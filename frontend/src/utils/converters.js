import katex from "katex";
import {
  extractLatexContent,
  wrapInLatexDocument,
  hasMathDelimiters,
  containsMathExpressions,
  containsNaturalLanguage,
  formatMathFunctions,
} from "./latexUtils";
import {
  HTML_DOCUMENT_TEMPLATE,
  KATEX_CONFIG,
  KATEX_INLINE_CONFIG,
} from "../constants";

/**
 * Converts user input to LaTeX format
 *
 * This function handles:
 * - Empty input
 * - Input with existing math delimiters
 * - Pure math expressions
 * - Mixed content (text and math)
 *
 * @param {string} input - Raw user input to convert
 * @returns {string} Complete LaTeX document
 */
export function convertToLatex(input) {
  try {
    // Handle empty input
    if (!input || !input.trim()) {
      return wrapInLatexDocument("");
    }

    // Process the input based on content type
    let processedInput = input;
    const mathDelimitersExist = hasMathDelimiters(input);

    if (!mathDelimitersExist) {
      processedInput = processMathContent(input);
    }

    // Generate LaTeX content from processed input
    const latexContent = generateLatexContent(
      processedInput,
      mathDelimitersExist
    );

    // Return complete LaTeX document
    return wrapInLatexDocument(latexContent);
  } catch (error) {
    console.error("LaTeX conversion error:", error);
    return wrapInLatexDocument("Error in conversion");
  }
}

/**
 * Process input content to identify and wrap math expressions
 *
 * @param {string} input - Raw input text
 * @returns {string} Processed input with math parts properly delimited
 */
function processMathContent(input) {
  const containsMath = containsMathExpressions(input);
  const hasNaturalLanguage = containsNaturalLanguage(input);

  if (containsMath && hasNaturalLanguage) {
    // Mixed content, identify and mark math parts
    return (
      input
        // Mark equations
        .replace(/([a-z0-9]+)\s*=\s*([a-z0-9\+\-\*\/\^\(\)]+)/gi, "$ $& $")
        // Mark math expressions
        .replace(/\b(sin|cos|tan|log|ln)\s*\(([^)]+)\)/g, "$ $& $")
        .replace(/\b(sin|cos|tan|log|ln)\^[0-9]+/g, "$ $& $")
        .replace(/\\(frac|sqrt|sum|int|lim|inf)/g, "$ \\$1 $")
        // Mark exponents and subscripts
        .replace(/([a-z0-9])[\^\_][a-z0-9]/gi, "$ $& $")
        // Clean up any duplicate/adjacent delimiters
        .replace(/\$\s+\$/g, "$")
        .replace(/(\$[^$]*)\$\s*\$([^$]*\$)/g, "$1$2")
    );
  } else if (!hasNaturalLanguage) {
    // Pure math content, wrap everything
    return `$ ${input} $`;
  }

  // Return as-is if it's pure text
  return input;
}

/**
 * Generate LaTeX content from processed input
 *
 * @param {string} processedInput - Input with proper math delimiters
 * @param {boolean} mathDelimitersExist - Whether the original input had math delimiters
 * @returns {string} Formatted LaTeX content
 */
function generateLatexContent(processedInput, mathDelimitersExist) {
  // If no math delimiters exist and none were added, process as plain text
  if (!mathDelimitersExist && !processedInput.includes("$")) {
    return processedInput
      .replace(/\^2/g, "^{2}")
      .replace(/\^(\w)/g, "^{$1}")
      .replace(/([a-zA-Z]+)_(\w+)/g, "$1_{$2}")
      .replace(/([^\\])sqrt\(([^)]+)\)/g, "$1\\sqrt{$2}")
      .replace(/(\d+|\))(\()/g, "$1 \\cdot $2")
      .replace(/(\d+)([a-zA-Z])/g, "$1 \\cdot $2");
  }

  // Process input with math delimiters
  let latexContent = "";
  const parts = processedInput.split(/(\$[^$]*?\$)/g);

  for (let part of parts) {
    part = part.trim();
    if (!part) continue;

    if (part.startsWith("$") && part.endsWith("$")) {
      // Process math content
      const mathContent = part.slice(1, -1).trim();
      const formattedMath = formatMathFunctions(mathContent);
      latexContent += `$${formattedMath}$`;
    } else {
      // Add text content unchanged
      latexContent += part;
    }
  }

  return latexContent;
}

/**
 * Converts LaTeX code to HTML with KaTeX rendering
 *
 * @param {string} latexCode - LaTeX document to convert
 * @returns {string} HTML document with rendered math
 */
export function convertToHTML(latexCode) {
  try {
    const content = extractLatexContent(latexCode);
    if (!content) {
      return createHTMLDocument("<p>No content to display</p>");
    }

    const mathDelimitersExist = hasMathDelimiters(content);
    let htmlBody = "";

    if (mathDelimitersExist) {
      htmlBody = renderMixedContentHTML(content);
    } else {
      htmlBody = renderSingleContentHTML(content);
    }

    return createHTMLDocument(htmlBody);
  } catch (error) {
    console.error("HTML conversion error:", error);
    return createHTMLDocument(
      `<p style="color: red;">Error: ${error.message}</p>`
    );
  }
}

/**
 * Renders HTML for content that mixes text and math
 *
 * @param {string} content - Mixed content with math delimiters
 * @returns {string} HTML content with rendered math
 */
function renderMixedContentHTML(content) {
  try {
    let htmlContent = "<p>";
    let inMath = false;
    let currentText = "";
    let mathText = "";

    // Parse content character by character
    for (let i = 0; i < content.length; i++) {
      if (content[i] === "$") {
        if (inMath) {
          // Render math section
          try {
            const rendered = katex.renderToString(
              mathText.trim(),
              KATEX_INLINE_CONFIG
            );
            htmlContent += `<span class="math-inline">${rendered}</span>`;
          } catch (err) {
            htmlContent += `<span style="color: red;">[Math Error: ${mathText}]</span>`;
          }
          mathText = "";
          inMath = false;
        } else {
          // End text section, start math section
          if (currentText) {
            htmlContent += escapeHTML(currentText);
            currentText = "";
          }
          inMath = true;
        }
      } else {
        // Add character to appropriate buffer
        if (inMath) {
          mathText += content[i];
        } else {
          currentText += content[i];
        }
      }
    }

    // Add any remaining text
    if (currentText) {
      htmlContent += escapeHTML(currentText);
    }

    return htmlContent + "</p>";
  } catch (err) {
    console.error("Mixed content parsing error:", err);
    return `<p style="color: red;">Error parsing mixed content: ${
      err.message
    }</p>
            <pre>${escapeHTML(content)}</pre>`;
  }
}

/**
 * Renders HTML for single-type content (either all math or all text)
 *
 * @param {string} content - Content to render
 * @returns {string} HTML content
 */
function renderSingleContentHTML(content) {
  // Check if content looks like math
  const isMathContent = containsMathExpressions(content);

  if (isMathContent) {
    // Render as math
    try {
      const rendered = katex.renderToString(content.trim(), KATEX_CONFIG);
      return `<div class="math">${rendered}</div>`;
    } catch (err) {
      console.error("KaTeX rendering error:", err);
      return `<p style="color: red;">Math rendering error: ${err.message}</p>
              <pre>${escapeHTML(content)}</pre>`;
    }
  } else {
    // Render as plain text
    return `<p>${escapeHTML(content)}</p>`;
  }
}

/**
 * Creates a complete HTML document
 *
 * @param {string} bodyContent - HTML content for the body
 * @returns {string} Complete HTML document
 */
function createHTMLDocument(bodyContent) {
  return HTML_DOCUMENT_TEMPLATE.replace("{content}", bodyContent);
}

/**
 * Escapes HTML special characters to prevent injection
 *
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHTML(text) {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
