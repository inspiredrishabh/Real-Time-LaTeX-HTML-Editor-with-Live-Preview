import { useCallback, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

/**
 * LaTeXPanel Component
 *
 * Ye component LaTeX code ko display aur edit karne ke liye hai.
 * User yahan se LaTeX code copy bhi kar sakta hai.
 */
export default function LaTeXPanel({ latexCode, onChange }) {
  // Editor value change hone par parent ko update karo
  const handleChange = useCallback((val) => onChange(val), [onChange]);
  // Copy button ka status
  const [copyStatus, setCopyStatus] = useState("");

  // Sirf essential LaTeX content copy karne ka function
  const copyEssentialLatex = async () => {
    try {
      // Document structure hata ke sirf main content copy karo
      const contentMatch =
        latexCode
          .split("\\begin{document}")[1]
          ?.split("\\end{document}")[0]
          ?.trim() || "";

      await navigator.clipboard.writeText(contentMatch);
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
      {/* Header with copy button */}
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-bold">LaTeX Code</h2>
        <button
          onClick={copyEssentialLatex}
          className="px-2 py-1 bg-blue-600 text-white text-sm rounded"
        >
          {copyStatus ? copyStatus : "Copy LaTeX"}
        </button>
      </div>
      {/* Code editor */}
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
