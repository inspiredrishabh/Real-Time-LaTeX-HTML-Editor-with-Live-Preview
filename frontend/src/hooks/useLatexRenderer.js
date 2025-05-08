import { useState, useEffect } from "react";
import katex from "katex";
import { KATEX_CONFIG, KATEX_INLINE_CONFIG } from "../constants";

/**
 * Custom hook for rendering LaTeX content
 *
 * @param {string} latexContent - LaTeX content to render
 * @returns {string} Rendered HTML string
 */
export const useLatexRenderer = (latexContent) => {
  const [renderedOutput, setRenderedOutput] = useState("");

  useEffect(() => {
    if (!latexContent || !latexContent.trim()) {
      setRenderedOutput("");
      return;
    }

    try {
      // Determine if content has math delimiters
      const hasMathDelimiters = /\$.*?\$/.test(latexContent);

      if (hasMathDelimiters) {
        renderMixedContent(latexContent);
      } else {
        renderPureMath(latexContent);
      }
    } catch (error) {
      console.error("LaTeX rendering error:", error);
      setRenderedOutput(
        `<span style="color: red;">LaTeX rendering error: ${error.message}</span>`
      );
    }
  }, [latexContent]);

  /**
   * Renders content that mixes text and math (using $ delimiters)
   */
  const renderMixedContent = (content) => {
    let result = "";
    let inMath = false;
    let currentText = "";
    let mathText = "";

    for (let i = 0; i < content.length; i++) {
      if (content[i] === "$") {
        if (inMath) {
          try {
            const rendered = katex.renderToString(
              mathText.trim(),
              KATEX_INLINE_CONFIG
            );
            result += `<span class="math-inline">${rendered}</span>`;
          } catch (err) {
            result += `<span style="color: red;">[Math Error: ${mathText}]</span>`;
          }
          mathText = "";
          inMath = false;
        } else {
          if (currentText) {
            result += currentText;
            currentText = "";
          }
          inMath = true;
        }
      } else {
        if (inMath) {
          mathText += content[i];
        } else {
          currentText += content[i];
        }
      }
    }

    if (currentText) {
      result += currentText;
    }

    setRenderedOutput(`<div class="preview-mixed-content">${result}</div>`);
  };

  /**
   * Renders pure mathematical content
   */
  const renderPureMath = (content) => {
    try {
      const rendered = katex.renderToString(content.trim(), KATEX_CONFIG);
      setRenderedOutput(rendered);
    } catch (error) {
      console.error("Pure math rendering error:", error);
      setRenderedOutput(
        `<span style="color: red;">Math rendering error: ${error.message}</span>`
      );
    }
  };

  return renderedOutput;
};
