import katex from "katex";

// Convert input to LaTeX
export function convertToLatex(input) {
  try {
    // Check if input is empty
    if (!input || !input.trim()) {
      return "\\documentclass{article}\n\\begin{document}\n\n\\end{document}";
    }

    // Check if input already contains math delimiters
    const hasMathDelimiters = /\$.*?\$/.test(input);
    let processedInput = input;

    if (!hasMathDelimiters) {
      // Detect if input might contain math expressions
      const potentialMathPattern =
        /[=\+\-\*\/\^\_]|sin|cos|tan|log|sqrt|frac|lim|\\\w+/;
      const containsMath = potentialMathPattern.test(input);

      // Check if it contains words (spaces between letters)
      const containsWords = /[a-zA-Z]+ [a-zA-Z]+/.test(input);

      if (containsMath && containsWords) {
        // Mixed content - try to auto-detect math parts
        processedInput = processedInput
          // Mark equations
          .replace(/([a-z0-9]+)\s*=\s*([a-z0-9\+\-\*\/\^\(\)]+)/gi, "$ $& $")
          // Mark common math expressions
          .replace(/\b(sin|cos|tan|log|ln)\s*\(([^)]+)\)/g, "$ $& $")
          .replace(/\b(sin|cos|tan|log|ln)\^[0-9]+/g, "$ $& $")
          .replace(/\\(frac|sqrt|sum|int|lim|inf)/g, "$ \\$1 $")
          // Mark variables with exponents or subscripts
          .replace(/([a-z0-9])[\^\_][a-z0-9]/gi, "$ $& $")
          // Clean up duplicate/adjacent delimiters
          .replace(/\$\s+\$/g, "$")
          .replace(/(\$[^$]*)\$\s*\$([^$]*\$)/g, "$1$2");
      } else if (!containsWords) {
        // Likely pure math - wrap everything
        processedInput = `$ ${processedInput} $`;
      }
      // else pure text - no need for math delimiters
    }

    // Process the input - handling math parts separately
    let latexContent = "";

    if (hasMathDelimiters || processedInput.includes("$")) {
      // Process mixed content with math delimiters
      const parts = processedInput.split(/(\$[^$]*?\$)/g);

      for (let part of parts) {
        part = part.trim();
        if (!part) continue;

        if (part.startsWith("$") && part.endsWith("$")) {
          // Math content - process and keep delimiters
          let mathContent = part.slice(1, -1).trim();

          // Process math content
          mathContent = mathContent
            // Handle functions with superscripts
            .replace(/sin\^(\d+|\{[^}]+\})/g, "\\sin^{$1}")
            .replace(/cos\^(\d+|\{[^}]+\})/g, "\\cos^{$1}")
            .replace(/tan\^(\d+|\{[^}]+\})/g, "\\tan^{$1}")
            // Handle regular functions
            .replace(/([^\\]|^)sin\(/g, "$1\\sin(")
            .replace(/([^\\]|^)cos\(/g, "$1\\cos(")
            .replace(/([^\\]|^)tan\(/g, "$1\\tan(")
            .replace(/([^\\]|^)log\(/g, "$1\\log(")
            .replace(/([^\\]|^)ln\(/g, "$1\\ln(")
            .replace(/([^\\]|^)sqrt\(([^)]+)\)/g, "$1\\sqrt{$2}")
            // Handle exponents and subscripts
            .replace(/\^(\d)/g, "^{$1}")
            .replace(/\^([a-zA-Z])/g, "^{$1}")
            .replace(/\_(\d)/g, "_{$1}")
            .replace(/\_([a-zA-Z])/g, "_{$1}")
            // Handle multiplication
            .replace(/(\d+|\))(\()/g, "$1 \\cdot $2")
            .replace(/(\d+)([a-zA-Z])/g, "$1 \\cdot $2");

          latexContent += `$${mathContent}$`;
        } else {
          // Regular text - keep as is
          latexContent += part;
        }
      }
    } else {
      // Regular text or pure math without delimiters
      latexContent = processedInput
        // Handle exponents and subscripts
        .replace(/\^2/g, "^{2}")
        .replace(/\^(\w)/g, "^{$1}")
        .replace(/([a-zA-Z]+)_(\w+)/g, "$1_{$2}")
        // Handle functions
        .replace(/([^\\])sqrt\(([^)]+)\)/g, "$1\\sqrt{$2}")
        // Handle multiplication
        .replace(/(\d+|\))(\()/g, "$1 \\cdot $2")
        .replace(/(\d+)([a-zA-Z])/g, "$1 \\cdot $2");
    }

    // Wrap in LaTeX document structure
    return `\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{xspace}
\\begin{document}

${latexContent}

\\end{document}`;
  } catch (error) {
    console.error("LaTeX conversion error:", error);
    return "\\documentclass{article}\n\\begin{document}\nError in conversion\n\\end{document}";
  }
}

// Convert LaTeX to HTML with KaTeX
export function convertToHTML(latexCode) {
  try {
    // Extract content between document tags
    const content =
      latexCode
        .split("\\begin{document}")[1]
        ?.split("\\end{document}")[0]
        ?.trim() || "";

    // Check if content contains math delimiters
    const hasMathDelimiters = /\$.*?\$/.test(content);

    // Basic HTML structure
    const htmlStart = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Math Document</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <style>
    body { 
      font-family: "Computer Modern", serif; 
      margin: 2em auto;
      line-height: 1.6;
      padding: 0 1em;
    }
    p {
      margin: 0.8em 0;
      text-align: justify;
    }
    .math { 
      text-align: center; 
      margin: 1em 0;
      font-size: 1.2em;
      overflow-x: auto;
      padding: 0.5em 0;
    }
    .math-inline { 
      padding: 0 0.2em; 
    }
    pre {
      white-space: pre-wrap;
      font-family: inherit;
      background-color: #f8f8f8;
      padding: 0.5em;
      border-radius: 4px;
    }
    .katex {
      font-size: 1.1em !important;
    }
    .katex .mspace {
      margin-right: 0.2em !important;
    }
    .katex-display {
      overflow-x: auto;
      overflow-y: hidden;
    }
    .katex-html {
      white-space: normal !important;
    }
    .katex .mord + .mord,
    .katex .mord + .mbin,
    .katex .mbin + .mord {
      margin-left: 0.15em !important;
    }
  </style>
</head>
<body>`;
    const htmlEnd = `</body></html>`;

    // Handle content based on type
    let htmlBody = "";

    if (hasMathDelimiters) {
      // Mixed content with math delimiters
      try {
        htmlBody = "<p>";

        // Better parser for dollar sign delimiters
        let inMath = false;
        let currentText = "";
        let mathText = "";

        for (let i = 0; i < content.length; i++) {
          if (content[i] === "$") {
            if (inMath) {
              // End math section - render it
              try {
                const rendered = katex.renderToString(mathText.trim(), {
                  throwOnError: false,
                  displayMode: false,
                });
                htmlBody += `<span class="math-inline">${rendered}</span>`;
              } catch (err) {
                htmlBody += `<span style="color: red;">[Math Error: ${mathText}]</span>`;
              }
              mathText = "";
              inMath = false;
            } else {
              // End text section, start math
              if (currentText) {
                htmlBody += currentText
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;");
                currentText = "";
              }
              inMath = true;
            }
          } else {
            // Add to current buffer (text or math)
            if (inMath) {
              mathText += content[i];
            } else {
              currentText += content[i];
            }
          }
        }

        // Add any remaining text
        if (currentText) {
          htmlBody += currentText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }

        htmlBody += "</p>";
      } catch (err) {
        console.error("Mixed content error:", err);
        htmlBody = `<p style="color: red;">Error parsing mixed content: ${
          err.message
        }</p>
                   <pre>${content
                     .replace(/</g, "&lt;")
                     .replace(/>/g, "&gt;")}</pre>`;
      }
    } else {
      // Check if it's likely math content
      const mathPattern = /[=\+\-\*\/\^\_]|\\(frac|sum|int|sqrt|lim)/;
      const isMathContent = mathPattern.test(content);

      if (isMathContent) {
        // Render as math
        try {
          const rendered = katex.renderToString(content.trim(), {
            throwOnError: false,
            displayMode: true,
            macros: {
              "\\;": "\\space",
              "\\:": "\\space",
            },
          });
          htmlBody = `<div class="math">${rendered}</div>`;
        } catch (err) {
          console.error("KaTeX error:", err);
          htmlBody = `<p style="color: red;">Math rendering error: ${
            err.message
          }</p>
                     <pre>${content
                       .replace(/</g, "&lt;")
                       .replace(/>/g, "&gt;")}</pre>`;
        }
      } else {
        // Render as plain text
        htmlBody = `<p>${content
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</p>`;
      }
    }

    return htmlStart + htmlBody + htmlEnd;
  } catch (error) {
    console.error("HTML conversion error:", error);
    return `<!DOCTYPE html><html><body><p style="color: red;">Error: ${error.message}</p></body></html>`;
  }
}
