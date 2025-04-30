import { useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import MathToolbar from "./MathToolbar";

/**
 * MathEditor Component
 *
 * Ye main input editor hai jahan user apna question ya expression likhta hai.
 * Toolbar se symbol insert kar sakte ho, aur CodeMirror se edit kar sakte ho.
 */
export default function MathEditor({ value, onChange }) {
  // Editor value change hone par parent ko update karo
  const handleChange = useCallback((val) => onChange(val), [onChange]);

  // Toolbar se symbol insert karne ka function
  const insertSymbol = (symbol) => {
    // Simple implementation: symbol ko end mein add karo
    onChange(value + " " + symbol + " ");
  };

  return (
    <div>
      {/* Math symbols ki toolbar */}
      <MathToolbar onInsertSymbol={insertSymbol} />
      {/* Code editor */}
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
