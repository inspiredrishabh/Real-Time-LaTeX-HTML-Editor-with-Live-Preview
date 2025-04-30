import { useState, useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import MathEditor from "./components/MathEditor";
import LaTeXPanel from "./components/LaTeXPanel";
import HTMLPanel from "./components/HTMLPanel";
import { convertToLatex, convertToHTML } from "./utils/converters";
import "katex/dist/katex.min.css";
import katex from "katex";
import "./App.css";

/**
 * App Component
 *
 * Ye main layout hai. Responsive design aur modern look ke liye Tailwind classes use ki gayi hain.
 */
export default function App() {
  // State variables
  const [question, setQuestion] = useState("E = mc^2");
  const [latexCode, setLatexCode] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const [renderedLatex, setRenderedLatex] = useState("");

  // Jab bhi question change ho, LaTeX code update karo
  useEffect(() => {
    const latex = convertToLatex(question);
    setLatexCode(latex);
  }, [question]);

  // Jab bhi LaTeX code change ho, HTML aur rendered preview update karo
  useEffect(() => {
    const html = convertToHTML(latexCode);
    setHtmlCode(html);

    // LaTeX content extract karo (document structure ke bina)
    const latexContent =
      latexCode
        .split("\\begin{document}")[1]
        ?.split("\\end{document}")[0]
        ?.trim() || "";

    // Dekho math delimiters hain ya nahi
    const hasMathDelimiters = /\$.*?\$/.test(latexContent);

    // KaTeX se render karo
    try {
      if (hasMathDelimiters) {
        let renderedOutput = "";
        let inMath = false;
        let currentText = "";
        let mathText = "";

        for (let i = 0; i < latexContent.length; i++) {
          if (latexContent[i] === "$") {
            if (inMath) {
              try {
                const rendered = katex.renderToString(mathText.trim(), {
                  throwOnError: false,
                  displayMode: false,
                });
                renderedOutput += `<span class="math-inline">${rendered}</span>`;
              } catch (err) {
                renderedOutput += `<span style="color: red;">[Math Error: ${mathText}]</span>`;
              }
              mathText = "";
              inMath = false;
            } else {
              if (currentText) {
                renderedOutput += currentText;
                currentText = "";
              }
              inMath = true;
            }
          } else {
            if (inMath) {
              mathText += latexContent[i];
            } else {
              currentText += latexContent[i];
            }
          }
        }
        if (currentText) {
          renderedOutput += currentText;
        }
        setRenderedLatex(
          `<div class="preview-mixed-content">${renderedOutput}</div>`
        );
      } else {
        const rendered = katex.renderToString(latexContent.trim(), {
          throwOnError: false,
          displayMode: true,
          macros: {
            "\\;": "\\space",
            "\\:": "\\space",
          },
        });
        setRenderedLatex(rendered);
      }
    } catch (error) {
      console.error("LaTeX rendering error:", error);
      setRenderedLatex(
        `<span style="color: red;">LaTeX rendering error: ${error.message}</span>`
      );
    }
  }, [latexCode]);

  return (
    // Majestic responsive container with gradient and glass effect
    <div className="app-container min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100">
      {/* Header with glassmorphism and shadow */}
      <header className="backdrop-blur-md bg-gradient-to-r from-white/90 via-blue-50/80 to-indigo-50/90 shadow-xl border-b border-blue-200 px-5 py-5 flex items-center justify-center sticky top-0 z-20 transition-all duration-300">
        <div className="relative">
          <h1 className="text-2xl md:text-4xl font-black tracking-tight drop-shadow-sm">
            <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
              Math Document Generator
            </span>
          </h1>
        </div>
      </header>

      {/* Enhanced main content area with subtle texture */}
      <main
        className="flex-1 w-full flex flex-col p-2 md:p-4 bg-gradient-to-br from-blue-50/40 to-indigo-50/60"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%234b68d5' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E')",
        }}
      >
        <PanelGroup direction="horizontal" className="flex-1 min-h-0">
          {/* Left Panel: Completely redesigned with premium styling */}
          <Panel defaultSize={40} minSize={20} className="min-w-[260px]">
            <div className="h-full flex flex-col bg-white/95 p-3 md:p-6 gap-3 md:gap-6 overflow-auto rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] border border-blue-100 transition-all duration-300 hover:shadow-[0_15px_50px_-12px_rgba(0,0,0,0.15)]">
              <div className="flex items-center gap-2 border-b pb-3 border-blue-100">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1.5 rounded-lg shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-lg md:text-xl font-bold text-slate-800">
                  Write Your Expression
                </h2>
              </div>
              <div className="flex-1 flex flex-col">
                <MathEditor value={question} onChange={setQuestion} />
              </div>

              {/* Redesigned previews section */}
              <div className="flex flex-col gap-5 mt-4">
                {/* LaTeX Preview - completely redesigned */}
                <section className="p-4 border border-blue-200 rounded-xl shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 transition-all hover:shadow-lg">
                  <h3 className="font-semibold text-indigo-700 mb-2">
                    LaTeX Preview
                  </h3>
                  <div className="mt-1 md:mt-2 p-2 md:p-3 bg-white/80 rounded-lg border">
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-1">
                        Rendered Output:
                      </h4>
                      <div className="p-2 bg-indigo-50/60 rounded-lg latex-preview-container overflow-x-auto">
                        <div
                          className="latex-preview-content"
                          dangerouslySetInnerHTML={{ __html: renderedLatex }}
                        />
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t">
                      <h4 className="text-sm font-medium text-gray-600 mb-1">
                        Raw LaTeX Code:
                      </h4>
                      <pre className="p-2 bg-indigo-50/60 rounded whitespace-pre-wrap font-mono text-xs md:text-sm overflow-auto max-h-40">
                        {latexCode
                          .split("\\begin{document}")[1]
                          ?.split("\\end{document}")[0] || ""}
                      </pre>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-indigo-500">
                    <p>
                      Tip: Use <span className="font-mono">$</span> signs to
                      mark math expressions in text, like:
                      <br />
                      <span className="font-mono">
                        The formula is $E=mc^2$ where...
                      </span>
                    </p>
                  </div>
                </section>

                {/* HTML Preview */}
                <section className="p-2 md:p-4 border rounded-xl shadow bg-gradient-to-br from-white via-indigo-50 to-purple-50">
                  <h3 className="font-semibold text-indigo-700 mb-2">
                    HTML Preview
                  </h3>
                  <div
                    className="mt-1 p-2 bg-white/80 rounded-lg html-preview-container overflow-x-auto"
                    style={{ minHeight: 60 }}
                    dangerouslySetInnerHTML={{ __html: htmlCode }}
                  />
                </section>
              </div>
            </div>
          </Panel>

          {/* Resize handle for horizontal panels */}
          <PanelResizeHandle className="resize-handle">
            <div className="handle-line"></div>
          </PanelResizeHandle>

          {/* Right Panel: LaTeX & HTML Editors */}
          <Panel minSize={20}>
            <PanelGroup direction="vertical" className="h-full">
              {/* LaTeX Editor Panel */}
              <Panel defaultSize={50} minSize={20}>
                <div className="h-full flex flex-col bg-white/80 rounded-xl shadow-xl border border-indigo-100">
                  <LaTeXPanel latexCode={latexCode} onChange={setLatexCode} />
                </div>
              </Panel>

              {/* Resize handle for vertical panels */}
              <PanelResizeHandle className="resize-handle">
                <div className="handle-line"></div>
              </PanelResizeHandle>

              {/* HTML Editor Panel */}
              <Panel minSize={20}>
                <div className="h-full flex flex-col bg-white/80 rounded-xl shadow-xl border border-indigo-100">
                  <HTMLPanel htmlCode={htmlCode} onChange={setHtmlCode} />
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </main>
    </div>
  );
}
