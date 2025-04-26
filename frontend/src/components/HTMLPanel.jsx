import { useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';

export default function HTMLPanel({ htmlCode, onChange }) {
  const handleChange = useCallback((val) => onChange(val), [onChange]);
  
  const downloadHTML = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'math_document.html';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="h-full flex flex-col bg-white p-4">
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-bold">HTML Code</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => navigator.clipboard.writeText(htmlCode)} 
            className="px-2 py-1 bg-blue-600 text-white text-sm rounded"
          >
            Copy
          </button>
          <button 
            onClick={downloadHTML}
            className="px-2 py-1 border text-sm rounded hover:bg-gray-100"
          >
            Download
          </button>
        </div>
      </div>
      
      <CodeMirror
        value={htmlCode}
        height="calc(100% - 40px)"
        extensions={[html()]}
        onChange={handleChange}
        className="border rounded"
      />
    </div>
  );
}