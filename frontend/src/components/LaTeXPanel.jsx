import { useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export default function LaTeXPanel({ latexCode, onChange }) {
  const handleChange = useCallback((val) => onChange(val), [onChange]);
  
  return (
    <div className="h-full flex flex-col bg-white p-4">
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-bold">LaTeX Code</h2>
        <button 
          onClick={() => navigator.clipboard.writeText(latexCode)}
          className="px-2 py-1 bg-blue-600 text-white text-sm rounded"
        >
          Copy LaTeX
        </button>
      </div>
      
      <CodeMirror
        value={latexCode}
        height="calc(100% - 40px)"
        extensions={[javascript()]}
        onChange={handleChange}
        className="border rounded flex-1"
      />
    </div>
  );
}