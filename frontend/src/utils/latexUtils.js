import { LATEX_DOCUMENT_TEMPLATE } from "../constants";

/**
 * Extracts the main content from a LaTeX document
 *
 * @param {string} latexCode - Full LaTeX document
 * @returns {string} Extracted content between \begin{document} and \end{document}
 */
export const extractLatexContent = (latexCode) => {
  if (!latexCode) return "";

  return (
    latexCode
      .split("\\begin{document}")[1]
      ?.split("\\end{document}")[0]
      ?.trim() || ""
  );
};

/**
 * Creates a valid LaTeX document by wrapping content in proper structure
 *
 * @param {string} content - LaTeX content to wrap
 * @returns {string} Complete LaTeX document
 */
export const wrapInLatexDocument = (content) => {
  return LATEX_DOCUMENT_TEMPLATE.replace("{content}", content || "");
};

/**
 * Check if text contains math delimiters ($...$)
 *
 * @param {string} text - Text to check
 * @returns {boolean} True if text contains math delimiters
 */
export const hasMathDelimiters = (text) => {
  return /\$.*?\$/.test(text);
};

/**
 * Check if text contains mathematical expressions
 *
 * @param {string} text - Text to check
 * @returns {boolean} True if text appears to contain math
 */
export const containsMathExpressions = (text) => {
  const mathPattern = /[=\+\-\*\/\^\_]|sin|cos|tan|log|sqrt|frac|lim|\\\w+/;
  return mathPattern.test(text);
};

/**
 * Check if text contains natural language (words separated by spaces)
 *
 * @param {string} text - Text to check
 * @returns {boolean} True if text contains natural language
 */
export const containsNaturalLanguage = (text) => {
  return /[a-zA-Z]+ [a-zA-Z]+/.test(text);
};

/**
 * Format mathematical functions in LaTeX syntax
 *
 * @param {string} content - Content to format
 * @returns {string} Formatted content
 */
export const formatMathFunctions = (content) => {
  return (
    content
      // Functions with superscripts
      .replace(/sin\^(\d+|\{[^}]+\})/g, "\\sin^{$1}")
      .replace(/cos\^(\d+|\{[^}]+\})/g, "\\cos^{$1}")
      .replace(/tan\^(\d+|\{[^}]+\})/g, "\\tan^{$1}")
      // Basic functions
      .replace(/([^\\]|^)sin\(/g, "$1\\sin(")
      .replace(/([^\\]|^)cos\(/g, "$1\\cos(")
      .replace(/([^\\]|^)tan\(/g, "$1\\tan(")
      .replace(/([^\\]|^)log\(/g, "$1\\log(")
      .replace(/([^\\]|^)ln\(/g, "$1\\ln(")
      .replace(/([^\\]|^)sqrt\(([^)]+)\)/g, "$1\\sqrt{$2}")
      // Exponents and subscripts
      .replace(/\^(\d)/g, "^{$1}")
      .replace(/\^([a-zA-Z])/g, "^{$1}")
      .replace(/\_(\d)/g, "_{$1}")
      .replace(/\_([a-zA-Z])/g, "_{$1}")
      // Multiplication notation
      .replace(/(\d+|\))(\()/g, "$1 \\cdot $2")
      .replace(/(\d+)([a-zA-Z])/g, "$1 \\cdot $2")
  );
};
