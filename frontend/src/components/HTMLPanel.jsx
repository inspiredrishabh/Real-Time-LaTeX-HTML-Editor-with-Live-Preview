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

  // Sirf essential HTML content copy karne ka function
  const copyEssentialHTML = async () => {
    try {
      let essentialContent = "";
      // Math ya paragraph content dhoondo
      const mathMatch = htmlCode.match(/<div class="math">([\s\S]*?)<\/div>/);
      const paragraphMatch = htmlCode.match(/<p>([\s\S]*?)<\/p>/);

      if (mathMatch) {
        essentialContent = mathMatch[0];
      } else if (paragraphMatch) {
        essentialContent = paragraphMatch[0];
      } else {
        // Fallback: body ke andar ka content
        const bodyMatch = htmlCode.match(/<body>([\s\S]*?)<\/body>/);
        if (bodyMatch) {
          essentialContent = bodyMatch[1].trim();
        } else {
          essentialContent = htmlCode;
        }
      }

      await navigator.clipboard.writeText(essentialContent);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(""), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      setCopyStatus("Failed to copy");
      setTimeout(() => setCopyStatus(""), 2000);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white p-4">
      {/* Header with copy/download buttons */}
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-bold">HTML Code</h2>
        <div className="flex space-x-2">
          <button
            onClick={copyEssentialHTML}
            className="px-2 py-1 bg-blue-600 text-white text-sm rounded relative"
          >
            {copyStatus ? copyStatus : "Copy Content"}
          </button>
          <button
            onClick={downloadHTML}
            className="px-2 py-1 border text-sm rounded hover:bg-gray-100"
          >
            Download
          </button>
        </div>
      </div>
      {/* Code editor */}
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
