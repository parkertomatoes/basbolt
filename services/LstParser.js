function _tryReadLine(line, pattern, onMatch) {
    pattern.lastIndex = 0;
    const match = pattern.exec(line);
    return match === null ? null : onMatch(match);
}

const SOURCE_LINE_PATTERN = /^ ([A-Z0-9]{4,4})   ([A-Z0-9]{4,4})    (.*)/;
const _tryReadSourceLine = line => _tryReadLine(line, SOURCE_LINE_PATTERN, ([_, offset, data, text]) => ({
    offset: Number(`0x${offset}`),
    data: Number(`0x${data}`),
    text}));

const ERROR_LINE_PATTERN = /^ {16,16}( {0,61})\^\x07 (.*)/;
const _tryReadErrorLine = line => _tryReadLine(line, ERROR_LINE_PATTERN, ([_, colSpacing, message]) => ({ column: colSpacing.length + 1, message }));

const CONTINUED_LINE_PATTERN = /^ {16,16}(.*)/;
const _tryReadContinuedLine = line => _tryReadLine(line, CONTINUED_LINE_PATTERN, ([_, text]) => ({ text }));

const ASM_LINE_PATTERN = /^ ([A-Z0-9]{4,4})    \*\*     (.*)/;
const _tryReadAsmLine = line => _tryReadLine(line, ASM_LINE_PATTERN, ([_, offset, text]) => ({ 
    offset: Number(`0x${offset}`),
    text
}));

const STATE_START = 0;
const STATE_SOURCE = 1;
const STATE_ERROR = 2;
const STATE_ASM = 3;
export default function parseLst(text) {
    const blocks = [];
    const errors = [];
    const lines = [];

    let state = STATE_START;
    let lineNumber = 0;
    for (const line of text.split(/\r?\n/)) {
        const lastBlock = blocks.length > 0 ? blocks[blocks.length - 1] : null;
        const lastLine = lines.length > 0 ? lines[lines.length - 1] : null;
        const lastError = errors.length > 0 ? errors[errors.length - 1] : null;

        const sourceLine = _tryReadSourceLine(line);
        if (sourceLine !== null) {
            const newLine = { line: ++lineNumber, ...sourceLine };
            if (lastLine !== null && lastLine.offset === sourceLine.offset) {
                lines.push(newLine);
                lastBlock.lines[1] = lineNumber;
            } else {
                lines.push(newLine);
                blocks.push({
                    lines: [lineNumber, lineNumber],
                    asm: []
                });
            }
            state = STATE_SOURCE;
            continue;
        }

        if (state === STATE_SOURCE || state === STATE_ERROR) {
            const errorLine = _tryReadErrorLine(line);
            if (errorLine !== null) {
                errors.push({ line: lineNumber, ...errorLine });
                state = STATE_ERROR;
                continue;
            }
        }

        if (state === STATE_SOURCE || state === STATE_ERROR) {
            const continuedLine = _tryReadContinuedLine(line);
            if (continuedLine !== null) {
                if (state === STATE_SOURCE) {
                    lastLine.text += continuedLine.text;
                } else if (state === STATE_ERROR) {
                    lastError.message += continuedLine.text;
                }
                continue;
            }
        }

        if (state === STATE_SOURCE || state === STATE_ASM) {
            const asmLine = _tryReadAsmLine(line);
            if (asmLine !== null) {
                state = STATE_ASM;
                lastBlock.asm.push(asmLine);
            }
        }
    }

    if (blocks.length > 0 && lines[blocks[blocks.length - 1].lines[0] - 1].text === '') {
        blocks.pop();
    }

    return { lines, blocks, errors };
}