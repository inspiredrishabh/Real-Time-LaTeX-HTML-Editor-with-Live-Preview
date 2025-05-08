/**
 * Application Constants
 *
 * This file contains all application-wide constants to ensure consistency
 * and make future updates easier.
 */

// Default expression when the application starts
export const DEFAULT_EXPRESSION = "E = mc^2";

// KaTeX rendering configuration
export const KATEX_CONFIG = {
  throwOnError: false,
  displayMode: true,
  macros: {
    "\\;": "\\space",
    "\\:": "\\space",
  },
};

// KaTeX inline rendering configuration
export const KATEX_INLINE_CONFIG = {
  throwOnError: false,
  displayMode: false,
};

// LaTeX document template
export const LATEX_DOCUMENT_TEMPLATE = `\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{xspace}
\\begin{document}

{content}

\\end{document}`;

// HTML document template with styling
export const HTML_DOCUMENT_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Math Document</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <style>
    body { 
      font-family: "Computer Modern", serif;
      line-height: 1.6;
      padding: 0.5em;
      margin: 0 auto;
      max-width: 800px;
    }
    p {
      margin: 0.8em 0;
      text-align: justify;
      padding-right: 0;
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
      padding-right: 0;
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
<body>{content}</body></html>`;
