import { useSelector } from 'react-redux';
import { useRef, useEffect, useState } from 'react';
const MonacoEditor = monaco_react.default;

const options = {
  selectOnLineNumbers: true,
  automaticLayout: true,
  readOnly: true
};

// Extract textual content from compilation output
function getContent(asm) {
  if (asm === null) {
    return {
      language: "text/plain",
      value: "No assembly generated"
    };
  } else if (asm.errors.length > 0) {
    return {
      language: "text/plain",
      value: asm.errors
        .map(error => `At line ${error.line}, column ${error.column}: ${error.message}`)
        .join('\n')
    };
  } else {
    return {
      language: "intelasm",
      value: asm.blocks
        .map(block => block.asm
          .map(instruction => instruction.text)
          .join('\n'))
        .join('\n')
    };
  }
}

// Extract block coloring from compilation output
function getDecorations(asm, Range) {
  if (!asm || asm.errors.length > 0) {
    return [];
  }

  let blockId = 0;
  let asmLine = 1;
  return asm.blocks.flatMap(block => {
    if (block.asm.length == 0) {
      return [];
    }
    const range = new Range(asmLine, 1, asmLine + block.asm.length - 1, 1);
    asmLine += block.asm.length;
    return [{
      range,
      options: {
        isWholeLine: true,
        className: `blockColor${blockId++ % 10}`
      }
    }];
  });
}

// Hook to animate a message with "..." at periodic intervals if a boolean state is active
function useElipsisTimer(isActive, message) {
  const [messageWithEllipsis, setMessageWithEllipsis] = useState(message);
  const intervalRef = useRef(null);

  const clearIntervalRef = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  useEffect(() => {
    clearIntervalRef();
    if (isActive) {
      let busyCounter = 0;
      intervalRef.current = setInterval(() => {
        busyCounter = (busyCounter + 1) & 3;
        setMessageWithEllipsis(message + '.'.repeat(busyCounter));
      }, 333);
    }
    return clearIntervalRef;
  }, [isActive]);

  return messageWithEllipsis;
}

export default function AsmView() {
  const asm = useSelector(({ asm }) => asm);
  const isCompiling = useSelector(({ isCompiling }) => isCompiling);
  const compilingMessage = useElipsisTimer(isCompiling, 'Compiling')
  const [editorReady, setEditorReady] = useState(false);
  const monacoRef = useRef(null);
  const decorRef = useRef([]);

  useEffect(() => {
    // Color code blocks after the list file is updated
    if (!monacoRef.current) 
      return;
    const { editor, monaco } = monacoRef.current;
    const oldDecor = decorRef.current;
    const newDecor = getDecorations(asm, monaco.Range);
    if (oldDecor.length > 0 || newDecor.length > 0) {
      decorRef.current = editor.deltaDecorations(oldDecor, newDecor);
    }
  }, [asm, editorReady]);

  const { language, value } = getContent(asm);

  return (
    <div className="asm-view">
      { isCompiling && <div className="asm-view-compiling">{compilingMessage}</div> }
      <MonacoEditor
        theme="vs-light"
        options={options}
        language={language}
        value={value}
        onMount={(editor, monaco) => { 
          monacoRef.current = { editor, monaco }; 
          setEditorReady(true); 
        }}
      />
    </div>
  );
}