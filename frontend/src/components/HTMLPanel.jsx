import { useCallback, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";

export default function HTMLPanel({ htmlCode, onChange }) {
  const handleChange = useCallback((val) => onChange(val), [onChange]);
  const [copyStatus, setCopyStatus] = useState("");

  const downloadHTML = () => {
    const blob = new Blob([htmlCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "math_document.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyEssentialHTML = async () => {
    try {
      // Extract the essential HTML content only
      let essentialContent = "";

      // Look for the math content or paragraph
      const mathMatch = htmlCode.match(/<div class="math">([\s\S]*?)<\/div>/);
      const paragraphMatch = htmlCode.match(/<p>([\s\S]*?)<\/p>/);

      if (mathMatch) {
        essentialContent = mathMatch[0];
      } else if (paragraphMatch) {
        essentialContent = paragraphMatch[0];
      } else {
        // Fallback - try to extract content between body tags
        const bodyMatch = htmlCode.match(/<body>([\s\S]*?)<\/body>/);
        if (bodyMatch) {
          essentialContent = bodyMatch[1].trim();
        } else {
          // No specific content found, use the whole code
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
