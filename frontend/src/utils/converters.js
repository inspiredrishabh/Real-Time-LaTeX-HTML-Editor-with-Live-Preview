import katex from 'katex';

// Convert input to LaTeX
export function convertToLatex(input) {
  try {
    let latexCode = input
      // Handle exponents and subscripts
      .replace(/\^2/g, '^{2}')
      .replace(/\^(\w)/g, '^{$1}')
      .replace(/([a-zA-Z]+)_(\w+)/g, '$1_{$2}')
      
      // Common math functions already have \ prefixes from toolbar
      .replace(/([^\\])sqrt\(([^)]+)\)/g, '$1\\sqrt{$2}')
      
      // Handle multiplication
      .replace(/(\d+|\))(\()/g, '$1 \\cdot $2')
      .replace(/(\d+)([a-zA-Z])/g, '$1 \\cdot $2');
      
    // Wrap in LaTeX document structure
    return `\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\begin{document}

${latexCode}

\\end{document}`;
  } catch (error) {
    console.error('LaTeX conversion error:', error);
    return '\\documentclass{article}\n\\begin{document}\nError in conversion\n\\end{document}';
  }
}

// Convert LaTeX to HTML with KaTeX
export function convertToHTML(latexCode) {
  try {
    // Extract content between document tags
    const content = latexCode.split('\\begin{document}')[1]?.split('\\end{document}')[0]?.trim() || '';
    
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
      margin: 2em; 
      line-height: 1.5; 
    }
    .math { 
      text-align: center; 
      margin: 1em 0;
      font-size: 1.2em;
    }
    .math-inline { 
      padding: 0 0.2em; 
    }
    pre {
      white-space: pre-wrap;
      font-family: inherit;
    }
  </style>
</head>
<body>`;
    const htmlEnd = `</body></html>`;

    // Process math expressions
    let htmlBody = '';
    
    // Check if content contains math expressions
    if (content.includes('=') || 
        content.includes('\\frac') || 
        content.includes('\\sum') ||
        content.includes('^') ||
        content.includes('_')) {
      try {
        // Preserve spaces in the rendered output using KaTeX
        const rendered = katex.renderToString(content.trim(), { 
          throwOnError: false,
          displayMode: true
        });
        htmlBody = `<div class="math">${rendered}</div>`;
      } catch (err) {
        // For errors, preserve spaces using pre tag
        htmlBody = `<pre>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
      }
    } else {
      // For regular text, preserve spaces using pre tag
      htmlBody = `<pre>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
    }
    
    return htmlStart + htmlBody + htmlEnd;
  } catch (error) {
    console.error('HTML conversion error:', error);
    return `<!DOCTYPE html><html><body><p>Error: ${error.message}</p></body></html>`;
  }
}