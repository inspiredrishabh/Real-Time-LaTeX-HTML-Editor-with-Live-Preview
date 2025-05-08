import PropTypes from "prop-types";
import { useClipboard } from "../../hooks/useClipboard";
import { extractLatexContent } from "../../utils/latexUtils";

/**
 * Display raw LaTeX output with copy functionality
 */
const RawLatexOutput = ({ latexCode }) => {
  const { copyToClipboard, copyStatus } = useClipboard();

  const handleCopy = async () => {
    const content = extractLatexContent(latexCode);
    await copyToClipboard(content);
  };

  const extractedContent = extractLatexContent(latexCode);

  return (
    <div className="mt-2 sm:mt-3 p-2 sm:p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-700">
          Raw LaTeX Code
        </h3>
        <button
          onClick={handleCopy}
          className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {copyStatus || "Copy"}
        </button>
      </div>
      <pre className="text-xs font-mono bg-gray-100 p-2 rounded-md overflow-auto max-h-24 sm:max-h-32">
        {extractedContent}
      </pre>
    </div>
  );
};

RawLatexOutput.propTypes = {
  latexCode: PropTypes.string.isRequired,
};

export default RawLatexOutput;
