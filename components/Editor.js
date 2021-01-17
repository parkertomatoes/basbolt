import { useDispatch, useSelector } from 'react-redux';
import { useRef, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { compile } from '../actions';

function getSourceDecorations(asm, Range) {
    if (!asm || asm.errors.length > 0) {
        return [];
    }

    let blockId = 0;
    return asm.blocks.flatMap(block => {
        if (block.asm.length == 0) {
            return [];
        }
        const [minLine, maxLine] = block.lines;
        const range = new Range(minLine, 1, maxLine, 1);
        return [{
            range,
            options: {
                isWholeLine: true,
                className: `blockColor${blockId++ % 10}`
            }
        }];
    });
}

function getErrorMarkers(asm) {
  if (asm === null) {
    return [];
  }
  return asm.errors.map(error => ({
    startLineNumber: error.line,
    startColumn: error.column,
    endLineNumber: error.line,
    endColumn: error.column,
    message: error.message,
    severity: monaco.MarkerSeverity.Error
  }));
}

export default function Editor({ parentDomNode }) {
  const dispatch = useDispatch();
  const asm = useSelector(({ asm }) => asm);
  const monacoRef = useRef(null);
  const decorRef = useRef([]);

  useEffect(() => {
    const { editor, monaco } = monacoRef.current;

    // ASM block highlighting
    const oldDecor = decorRef.current;
    const newDecor = getSourceDecorations(asm, monaco.Range);
    if (oldDecor.length > 0 || newDecor.length > 0) {
      decorRef.current = editor.deltaDecorations(oldDecor, newDecor);
    }

    // error markers
    const model = editor.getModel();
    const errors = getErrorMarkers(asm);
    monaco.editor.setModelMarkers(model, 'BC', errors);
  }, [asm]);

  const options = {
    selectOnLineNumbers: true,
    automaticLayout: true,
    fixedOverflowWidgets: true,
    overflowWidgetsDomNode: document.body
  };
  
  return (
    <MonacoEditor
      theme="vs-light"
      options={options}
      onChange={newValue => dispatch(compile(newValue))}
      editorDidMount={(editor, monaco) => {
        monacoRef.current = { editor, monaco };
        const model = monaco.editor.createModel("", "vb");
        model.setEOL(1);
        editor.setModel(model);
        
        for (const styleElement of document.getElementsByTagName('style')) {
          if (styleElement.innerHTML.includes('.monaco-editor .monaco-hover')) {
            styleElement.innerHTML = styleElement.innerHTML.replaceAll('.monaco-editor .monaco-hover', '.monaco-hover');
          }
          if (styleElement.innerHTML.includes('.monaco-editor .monaco-editor-overlay-message')) {
            styleElement.innerHTML = styleElement.innerHTML.replaceAll('.monaco-editor .monaco-editor-overlay-message', '.monaco-hover');
          }        }
      }}
    />
  );
}
