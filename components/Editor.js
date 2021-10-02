import { useDispatch, useSelector } from 'react-redux';
import { useRef, useEffect, useState } from 'react';
import { compile, updateSource, openHelp } from '../actions';

const MonacoEditor = monaco_react.default;

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

export default function Editor() {
  const dispatch = useDispatch();
  const asm = useSelector(({ asm }) => asm);
  const source = useSelector(({ source }) => source);
  const monacoRef = useRef(null);
  const decorRef = useRef([]);
  const [editorReady, setEditorReady] = useState(false);

  useEffect(() => {
    // Effect: component has mounted, compile default source
    dispatch(compile());
  }, []);

  useEffect(() => {
    // Effect: assembly has updated, update monaco decorations to highlight code
    if (!monacoRef.current)
      return;
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
  }, [asm, editorReady]);

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
      onChange={newValue => dispatch(updateSource(newValue))}
      value={source}
      onMount={(editor, monaco) => {
        monacoRef.current = { editor, monaco };
        setEditorReady(true);
        const model = monaco.editor.createModel(source, "vb");
        model.setEOL(1);
        editor.setModel(model);
        
        editor.addCommand(monaco.KeyCode.F1, function() {
          const position = editor.getPosition();
          const word = editor.getModel().getWordAtPosition(position);
          dispatch(openHelp(word ? word.word : ''));
        }, '');
        
        for (const styleElement of document.getElementsByTagName('style')) {
          if (styleElement.innerHTML.includes('.monaco-editor .monaco-hover')) {
            styleElement.innerHTML = styleElement.innerHTML.replaceAll('.monaco-editor .monaco-hover', '.monaco-hover');
          }
          if (styleElement.innerHTML.includes('.monaco-editor .monaco-editor-overlay-message')) {
            styleElement.innerHTML = styleElement.innerHTML.replaceAll('.monaco-editor .monaco-editor-overlay-message', '.monaco-hover');
          }
        }
      }}
      
    />
  );
}
