import { useState, useEffect } from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
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
 * Modern UI with proper routing and responsive design.
 */
export default function App() {
  // State variables
  const [question, setQuestion] = useState("E = mc^2");
  const [latexCode, setLatexCode] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const [renderedLatex, setRenderedLatex] = useState("");
  const location = useLocation();

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

  // Main app layout with routes
  return (
    <div className="app-container min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100">
      {/* Header with glassmorphism and shadow */}
      <header className="backdrop-blur-md bg-gradient-to-r from-white/90 via-blue-50/80 to-indigo-50/90 shadow-xl border-b border-blue-200 px-5 py-4 flex items-center justify-between sticky top-0 z-20 transition-all duration-300">
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-sm">
            <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
              Math Document Generator
            </span>
          </h1>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md"
                  : "hover:bg-indigo-100 text-indigo-700"
              }`
            }
          >
            LaTeX Editor
          </NavLink>
          <NavLink
            to="/html"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md"
                  : "hover:bg-indigo-100 text-indigo-700"
              }`
            }
          >
            HTML View
          </NavLink>
        </nav>
      </header>

      {/* Main content area with routes */}
      <main className="flex-1 w-full flex flex-col p-2 md:p-4 bg-gradient-to-br from-blue-50/40 to-indigo-50/60">
        <Routes>
          <Route
            path="/"
            element={
              <LatexView
                question={question}
                setQuestion={setQuestion}
                renderedLatex={renderedLatex}
                latexCode={latexCode}
                setLatexCode={setLatexCode}
              />
            }
          />
          <Route
            path="/html"
            element={<HTMLView htmlCode={htmlCode} setHtmlCode={setHtmlCode} />}
          />
        </Routes>
      </main>
    </div>
  );
}

/**
 * LatexView Component
 *
 * This is the main LaTeX editor view with enhanced layout
 */
function LatexView({
  question,
  setQuestion,
  renderedLatex,
  latexCode,
  setLatexCode,
}) {
  return (
    <PanelGroup direction="horizontal" className="flex-1 min-h-0">
      {/* Left Panel: Input Editor */}
      <Panel defaultSize={50} minSize={30} className="min-w-[260px]">
        <div className="h-full flex flex-col bg-white/95 p-3 md:p-6 gap-3 md:gap-6 overflow-auto rounded-xl shadow-lg border border-blue-100">
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

          {/* Raw LaTeX output */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-700">
                Raw LaTeX Code
              </h3>
              <button
                onClick={async () => {
                  const content =
                    latexCode
                      .split("\\begin{document}")[1]
                      ?.split("\\end{document}")[0]
                      ?.trim() || "";
                  await navigator.clipboard.writeText(content);
                }}
                className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Copy
              </button>
            </div>
            <pre className="text-xs font-mono bg-gray-100 p-2 rounded-md overflow-auto max-h-32">
              {latexCode
                .split("\\begin{document}")[1]
                ?.split("\\end{document}")[0]
                ?.trim() || ""}
            </pre>
          </div>
        </div>
      </Panel>

      {/* Resize handle */}
      <PanelResizeHandle className="resize-handle">
        <div className="handle-line"></div>
      </PanelResizeHandle>

      {/* Right Panel: LaTeX Preview */}
      <Panel minSize={40}>
        <div className="h-full flex flex-col bg-white/95 p-3 md:p-6 rounded-xl shadow-lg border border-blue-100">
          <div className="flex items-center gap-2 border-b pb-3 border-blue-100 mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-1.5 rounded-lg shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800">
              LaTeX Preview
            </h2>
          </div>

          {/* Rendered LaTeX preview */}
          <div className="flex-1 flex flex-col overflow-auto">
            <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-inner flex-1 flex items-center justify-center">
              <div
                className="latex-preview-container"
                dangerouslySetInnerHTML={{ __html: renderedLatex }}
              />
            </div>
          </div>
        </div>
      </Panel>
    </PanelGroup>
  );
}

/**
 * HTMLView Component
 *
 * This is the HTML view that shows both the code and preview
 */
function HTMLView({ htmlCode, setHtmlCode }) {
  const [fullScreen, setFullScreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <PanelGroup direction="vertical" className="flex-1 min-h-0">
      {/* Top panel: HTML preview */}
      <Panel defaultSize={60} minSize={30}>
        <div className="h-full flex flex-col bg-white/95 p-3 md:p-6 rounded-xl shadow-lg border border-blue-100">
          <div className="flex items-center justify-between border-b pb-3 border-blue-100 mb-4">
            <div className="flex items-center gap-2">
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
                HTML Preview
              </h2>
            </div>

            {/* Preview controls */}
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                title="Refresh preview"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                onClick={() => setFullScreen(!fullScreen)}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                title={fullScreen ? "Exit full screen" : "Full screen preview"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  {fullScreen ? (
                    <path
                      fillRule="evenodd"
                      d="M7.84 1.804A1 1 0 018.82 1h8.36a1 1 0 011 1v8.36a1 1 0 01-1.76.84L14.82 8l-4.9 4.9a1 1 0 01-1.42-1.42l4.9-4.9-3.2-1.6a1 1 0 01-.36-1.36l.02-.02zM1 10.82a1 1 0 011-.82h8.36a1 1 0 01.84 1.76L8 13.18l4.9 4.9a1 1 0 01-1.42 1.42l-4.9-4.9-1.6 3.2a1 1 0 01-1.36.36l-.02-.02A1 1 0 012 12.18V10.82a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M2.5 4A1.5 1.5 0 001 5.5V6h18v-.5A1.5 1.5 0 0017.5 4h-15zM19 8H1v6.5A1.5 1.5 0 002.5 16h15a1.5 1.5 0 001.5-1.5V8zM3 13.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm4.75-.75a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Improved HTML preview iframe with device frame and better padding */}
          <div
            className={`flex-1 overflow-hidden ${
              fullScreen ? "fixed inset-0 z-50 bg-white p-4" : "relative"
            }`}
          >
            <div
              className={`preview-device-frame ${
                fullScreen ? "h-full" : "h-full"
              }`}
            >
              <div className="preview-device-header">
                <div className="preview-device-controls">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="preview-device-title">Preview</div>
              </div>
              <div
                className="preview-device-content"
                style={{ padding: "0.25em 0.5em 0.25em 0.25em" }}
              >
                <iframe
                  key={refreshKey}
                  srcDoc={htmlCode}
                  title="HTML Preview"
                  className="w-full h-full border-0 html-preview-iframe"
                  style={{ marginRight: "-0.25em" }}
                  sandbox="allow-same-origin"
                />
              </div>
            </div>

            {fullScreen && (
              <button
                onClick={() => setFullScreen(false)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md"
                title="Exit full screen"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </Panel>

      {/* Resize handle */}
      <PanelResizeHandle className="resize-handle">
        <div className="handle-line"></div>
      </PanelResizeHandle>

      {/* Bottom panel: HTML editor */}
      <Panel minSize={30}>
        <div className="h-full flex flex-col bg-white/95 p-3 md:p-6 rounded-xl shadow-lg border border-blue-100">
          <HTMLPanel htmlCode={htmlCode} onChange={setHtmlCode} />
        </div>
      </Panel>
    </PanelGroup>
  );
}
