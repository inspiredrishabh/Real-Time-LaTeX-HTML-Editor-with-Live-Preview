import { useCallback, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";

/**
 * HTMLPanel Component
 *
 * Ye component HTML code ko display aur edit karne ke liye hai.
 * User yahan se HTML copy ya download bhi kar sakta hai.
 */
export default function HTMLPanel({ htmlCode, onChange }) {
  // Editor value change hone par parent ko update karo
  const handleChange = useCallback((val) => onChange(val), [onChange]);
  // Copy button ka status
  const [copyStatus, setCopyStatus] = useState("");

  // HTML file download karne ka function
  const downloadHTML = () => {
    const blob = new Blob([htmlCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "math_document.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Simplified function to copy the entire HTML content
  const copyFullHTML = async () => {
    try {
      await navigator.clipboard.writeText(htmlCode);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(""), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      setCopyStatus("Failed");
      setTimeout(() => setCopyStatus(""), 2000);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white p-4 overflow-hidden">
      {/* Header with copy/download buttons */}
      <div className="flex flex-wrap justify-between items-center mb-3 gap-2">
        <h2 className="text-lg font-bold">HTML Code</h2>
        <div className="flex space-x-2">
          <button
            onClick={copyFullHTML}
            className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            {copyStatus ? copyStatus : "Copy Full HTML"}
          </button>
          <button
            onClick={downloadHTML}
            className="px-2 py-1 border text-sm rounded hover:bg-gray-100"
          >
            Download
          </button>
        </div>
      </div>
      {/* Enhanced scrollable code editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <CodeMirror
          value={htmlCode}
          height="100%"
          extensions={[html()]}
          onChange={handleChange}
          className="border rounded overflow-auto flex-1"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            foldGutter: true,
          }}
        />
      </div>
    </div>
  );
}
