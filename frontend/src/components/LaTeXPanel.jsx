import { useCallback, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

export default function LaTeXPanel({ latexCode, onChange }) {
  const handleChange = useCallback((val) => onChange(val), [onChange]);
  const [copyStatus, setCopyStatus] = useState("");

  const copyEssentialLatex = async () => {
    try {
      // Extract only the essential LaTeX content without the document structure
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
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-bold">LaTeX Code</h2>
        <button
          onClick={copyEssentialLatex}
          className="px-2 py-1 bg-blue-600 text-white text-sm rounded"
        >
          {copyStatus ? copyStatus : "Copy LaTeX"}
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
