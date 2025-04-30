import katex from "katex";

/**
 * convertToLatex
 *
 * Ye function user ke input ko LaTeX document mein convert karta hai.
 * - Agar input empty hai to ek blank LaTeX document return karta hai.
 * - Agar input mein math delimiters ($...$) nahi hain, to smartly math parts ko detect karke wrap karta hai.
 * - Mixed content ya pure math ko LaTeX format mein convert karta hai.
 */
export function convertToLatex(input) {
  try {
    // Agar input empty hai to blank LaTeX document return karo
    if (!input || !input.trim()) {
      return "\\documentclass{article}\n\\begin{document}\n\n\\end{document}";
    }

    // Dekho input mein already $...$ math delimiters hain ya nahi
    const hasMathDelimiters = /\$.*?\$/.test(input);
    let processedInput = input;

    if (!hasMathDelimiters) {
      // Math expressions dhoondhne ke liye pattern
      const potentialMathPattern =
        /[=\+\-\*\/\^\_]|sin|cos|tan|log|sqrt|frac|lim|\\\w+/;
      const containsMath = potentialMathPattern.test(input);

      // Dekho input mein words bhi hain ya nahi (mixed content)
      const containsWords = /[a-zA-Z]+ [a-zA-Z]+/.test(input);

      if (containsMath && containsWords) {
        // Mixed content hai, math parts ko $...$ se wrap karo
        processedInput = processedInput
          // Equations ko mark karo
          .replace(/([a-z0-9]+)\s*=\s*([a-z0-9\+\-\*\/\^\(\)]+)/gi, "$ $& $")
          // Common math expressions ko mark karo
          .replace(/\b(sin|cos|tan|log|ln)\s*\(([^)]+)\)/g, "$ $& $")
          .replace(/\b(sin|cos|tan|log|ln)\^[0-9]+/g, "$ $& $")
          .replace(/\\(frac|sqrt|sum|int|lim|inf)/g, "$ \\$1 $")
          // Exponents ya subscripts ko bhi mark karo
          .replace(/([a-z0-9])[\^\_][a-z0-9]/gi, "$ $& $")
          // Duplicate/adjacent delimiters ko clean karo
          .replace(/\$\s+\$/g, "$")
          .replace(/(\$[^$]*)\$\s*\$([^$]*\$)/g, "$1$2");
      } else if (!containsWords) {
        // Pure math hai, sabko ek hi $...$ mein wrap karo
        processedInput = `$ ${processedInput} $`;
      }
      // Agar pure text hai to kuch mat karo
    }

    // Input ko process karo, math aur text parts alag handle karo
    let latexContent = "";

    if (hasMathDelimiters || processedInput.includes("$")) {
      // Mixed content ya math delimiters ke saath process karo
      const parts = processedInput.split(/(\$[^$]*?\$)/g);

      for (let part of parts) {
        part = part.trim();
        if (!part) continue;

        if (part.startsWith("$") && part.endsWith("$")) {
          // Math content hai, usko process karo aur delimiters ke saath rakho
          let mathContent = part.slice(1, -1).trim();

          // Math content ko aur process karo (functions, exponents, etc.)
          mathContent = mathContent
            // Functions ke superscripts handle karo
            .replace(/sin\^(\d+|\{[^}]+\})/g, "\\sin^{$1}")
            .replace(/cos\^(\d+|\{[^}]+\})/g, "\\cos^{$1}")
            .replace(/tan\^(\d+|\{[^}]+\})/g, "\\tan^{$1}")
            // Functions ko LaTeX mein convert karo
            .replace(/([^\\]|^)sin\(/g, "$1\\sin(")
            .replace(/([^\\]|^)cos\(/g, "$1\\cos(")
            .replace(/([^\\]|^)tan\(/g, "$1\\tan(")
            .replace(/([^\\]|^)log\(/g, "$1\\log(")
            .replace(/([^\\]|^)ln\(/g, "$1\\ln(")
            .replace(/([^\\]|^)sqrt\(([^)]+)\)/g, "$1\\sqrt{$2}")
            // Exponents aur subscripts
            .replace(/\^(\d)/g, "^{$1}")
            .replace(/\^([a-zA-Z])/g, "^{$1}")
            .replace(/\_(\d)/g, "_{$1}")
            .replace(/\_([a-zA-Z])/g, "_{$1}")
            // Multiplication ko LaTeX style mein karo
            .replace(/(\d+|\))(\()/g, "$1 \\cdot $2")
            .replace(/(\d+)([a-zA-Z])/g, "$1 \\cdot $2");

          latexContent += `$${mathContent}$`;
        } else {
          // Normal text hai, waise hi add karo
          latexContent += part;
        }
      }
    } else {
      // Pure text ya pure math (delimiters ke bina)
      latexContent = processedInput
        // Exponents aur subscripts
        .replace(/\^2/g, "^{2}")
        .replace(/\^(\w)/g, "^{$1}")
        .replace(/([a-zA-Z]+)_(\w+)/g, "$1_{$2}")
        // Functions
        .replace(/([^\\])sqrt\(([^)]+)\)/g, "$1\\sqrt{$2}")
        // Multiplication
        .replace(/(\d+|\))(\()/g, "$1 \\cdot $2")
        .replace(/(\d+)([a-zA-Z])/g, "$1 \\cdot $2");
    }

    // LaTeX document structure mein wrap karo
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

/**
 * convertToHTML
 *
 * Ye function LaTeX code ko HTML mein convert karta hai, KaTeX ka use karke.
 * - Document structure se sirf main content nikalta hai.
 * - Math aur text ko alag-alag handle karta hai.
 * - KaTeX se render karke HTML return karta hai.
 */
export function convertToHTML(latexCode) {
  try {
    // Document ke andar ka content nikaalo
    const content =
      latexCode
        .split("\\begin{document}")[1]
        ?.split("\\end{document}")[0]
        ?.trim() || "";

    // Dekho math delimiters hain ya nahi
    const hasMathDelimiters = /\$.*?\$/.test(content);

    // HTML ka basic structure
    const htmlStart = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Math Document</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <style>
    body { 
      font-family: "Computer Modern", serif;
      line-height: 1.6;
      padding: 0em;
      margin: 0em;
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

    // Content ko type ke hisaab se handle karo
    let htmlBody = "";

    if (hasMathDelimiters) {
      // Mixed content hai, math delimiters ke saath
      try {
        htmlBody = "<p>";

        // Dollar sign delimiters ka parser
        let inMath = false;
        let currentText = "";
        let mathText = "";

        for (let i = 0; i < content.length; i++) {
          if (content[i] === "$") {
            if (inMath) {
              // Math section end ho gaya, render karo
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
              // Text section end, ab math start karo
              if (currentText) {
                htmlBody += currentText
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;");
                currentText = "";
              }
              inMath = true;
            }
          } else {
            // Buffer mein add karo (text ya math)
            if (inMath) {
              mathText += content[i];
            } else {
              currentText += content[i];
            }
          }
        }

        // Jo text bacha hai, usko bhi add karo
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
      // Dekho math content hai ya plain text
      const mathPattern = /[=\+\-\*\/\^\_]|\\(frac|sum|int|sqrt|lim)/;
      const isMathContent = mathPattern.test(content);

      if (isMathContent) {
        // Math content hai, KaTeX se render karo
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
        // Plain text hai, as it is render karo
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
