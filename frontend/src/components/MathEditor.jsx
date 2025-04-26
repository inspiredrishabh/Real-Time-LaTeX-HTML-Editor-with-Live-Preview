import { useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import MathToolbar from './MathToolbar';

export default function MathEditor({ value, onChange }) {
  const handleChange = useCallback((val) => onChange(val), [onChange]);
  
  const insertSymbol = (symbol) => {
    // Get cursor position if we have access to the editor
    // For this simple implementation, just append to the end
    onChange(value + ' ' + symbol + ' ');
  };

  return (
    <div>
      <MathToolbar onInsertSymbol={insertSymbol} />
      <CodeMirror
        value={value}
        height="180px"
        extensions={[javascript()]}
        onChange={handleChange}
        className="border rounded p-1 text-base"
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          highlightActiveLine: false,
        }}
      />
    </div>
  );
}