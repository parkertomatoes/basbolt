import { encode, decode } from './DosEncoder';

class SerialTaskQueue {
  constructor() {
    this.buffer = '';
    this.sentinel = '';
    this.numChars = -1;
    this.resolver = () => { };
    this.pending = Promise.resolve();
  }

  acceptChar(c) {
    this.buffer += c;
    if (this.numChars > 0 && (--this.numChars) == 0) {
      this.resolver(this.buffer);
      this.buffer = '';
    } else if (this.sentinel.length > 0 && this.buffer.endsWith(this.sentinel)) {
      this.resolver(this.buffer);
      this.buffer = '';
    }
  }

  queue(action, sentinel, followup = null) {
    return this._queue(action, sentinel, -1, followup);
  }

  queueFixedResponse(action, numChars, followup = null) {
    return this._queue(action, '', numChars, followup);
  }
  
  _queue(action, sentinel, numChars, followup) {
    this.pending = new Promise(resolver => this.pending.finally(() => {
      this.sentinel = sentinel;
      this.numChars = numChars;
      this.resolver = resolver;
      action();
    }));
    if (followup !== null) {
      this.pending = this.pending.then(followup);
    }
    return this.pending;
  }
}

class CompileQueue {
  constructor () {
    this.pending = { 
      promise: Promise.resolve(), 
      tryCancel: false
    };
  }

  queue(asyncAction) {
    this.pending.tryCancel = true;
    const pending = this.pending = {
      tryCancel: false, 
      promise: (() => {
        const doAction = () => pending.tryCancel ? { canceled: true } : asyncAction();
        return this.pending.promise.then(doAction, doAction);
      })()
    };
    return pending.promise;
  }
}

const ERROR_PATTERN = /\(err (\d+)\)/g;
export default class BasicCompiler {
  constructor(document) {
    this.container = document.createElement('div');
    const text = document.createElement('div');
    text.style.cssText = "white-space: pre; font: 14px monospace; line-height: 14px";
    this.container.appendChild(text);
    const canvas = document.createElement('canvas');
    canvas.style.display = 'none';
    this.container.appendChild(canvas);
    document.body.appendChild(this.container);

    this.emulator = new V86Starter({
      memory_size: 32 * 1024 * 1024,
      vga_memory_size: 2 * 1024 * 1024,
      screen_container: this.container,
      bios: { url: "seabios.bin" },
      vga_bios: { url: "vgabios.bin" },
      hda: { 
        "url": "basbolt.img",
        "async": true
      },
      autostart: true,
    });

    this.serial = new SerialTaskQueue();
    this.emulator.add_listener("serial0-output-char", c => {
      this.serial.acceptChar(c)
    });
    this.serial.queue(
      () => { }, 
      'ready\r\n',
      stdout => {
        const bufferMatch = /\(buffer (\d+), size (\d+)\)/g.exec(stdout);
        if (bufferMatch === null) {
          throw new Error(`expected buffer address, found ${JSON.stringify(stdout)}`);
        }
        const address = Number(bufferMatch[1]);
        const size = Number(bufferMatch[2]);
        this.bufferAddress = address;
        this.bufferSize = size;
      }
    );
    this.compileQueue = new CompileQueue();
  }

  async _sendCommands(commands) {
    const stdout = await this.serial.queue(() => {
      const combined = `${commands.join('\r\n')}\r\nECHO (err %ERRORLEVEL%) ready>COM1\r\n`;
      this.emulator.serial0_send(combined);
    }, 'ready\r\n');

  }

  writeBuffer(bytes) {
    this.emulator.write_memory(bytes, this.bufferAddress);
  }

  readBuffer() {
    return this.emulator.read_memory(this.bufferAddress, this.bufferSize);
  }

  compile(code) {
    if (code.length === 0) {
      return { lines: [], blocks: [], errors: [] };
    }

    return this.compileQueue.queue(async () => {
      await this.serial.queue(() => {
        this.emulator.serial0_send(`compile\nC:\\JOB.BAS\n${code.length}\n`);
      }, 'ready\r\n');

      // send source
      const codeBuffer = encode(code);
      for (let i = 0; i < codeBuffer.length; i += this.bufferSize) {
        const remaining = codeBuffer.length - i;
        const blockLength = Math.min(remaining, this.bufferSize);
        this.writeBuffer(codeBuffer.subarray(i, i + blockLength));
        const sentinel = remaining > this.bufferSize 
          ? 'ready\r\n' 
          : 'received\r\n';
        await this.serial.queue(() => {
          this.emulator.serial0_send('a');
        }, sentinel);
      }

      // wait for compilation
      const stdout = await this.serial.queue(() => { }, 'done\r\nready\r\n');
      const sizeMatch = /\(size (\d+)\)/g.exec(stdout);
      if (sizeMatch === null) {
        throw new Error(`Unexpected output: '${stdout}'`);
      }
      const lstBuffer = new Uint8Array(Number(sizeMatch[1]));

      // receive list file, last "ready" is main prompt
      for (let i = 0; i < lstBuffer.length; i += this.bufferSize) {
        const remaining = lstBuffer.length - i;
        const blockLength = Math.min(remaining, this.bufferSize);
        lstBuffer.set(this.readBuffer().subarray(0, blockLength), i);
        await this.serial.queue(() => {
          this.emulator.serial0_send('a');
        }, 'ready\r\n');
      }
      const lst = decode(lstBuffer);
      return { lst }
    });
  }

  close() {
    this.emulator.exit();
  }
}