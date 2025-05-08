# Math Document Generator

A powerful web application that allows you to write mathematical expressions and automatically converts them to LaTeX and HTML outputs with proper rendering.

## Features

- **Interactive Math Editor**: Write mathematical expressions with an intuitive toolbar
- **Real-time LaTeX Generation**: Automatically converts your input to LaTeX code
- **Rendered Math Preview**: See your expressions beautifully rendered with KaTeX
- **HTML Export**: Generate HTML output for web publishing
- **Responsive Layout**: Resize panels to customize your workspace
- **Symbol Toolbar**: Quick access to common mathematical symbols and Greek letters
- **Copy & Download**: Export your work in various formats

## Technology Stack

- React.js
- KaTeX for LaTeX rendering
- CodeMirror for code editing
- Tailwind CSS for styling
- React Resizable Panels for UI layout

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/inspiredrishabh/Real-Time-LaTeX-HTML-Editor-with-Live-Preview
cd latex/frontend
```

2. Install dependencies

```bash
npm install
# or
yarn
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage Guide

1. **Writing Expressions**: Type mathematical expressions in the left panel. Use the toolbar to insert special symbols.

2. **Using LaTeX Symbols**:

   - Greek letters: `\alpha`, `\beta`, `\gamma`
   - Fractions: `\frac{numerator}{denominator}`
   - Subscripts and superscripts: `x_2` and `x^2`
   - Square roots: `\sqrt{x}`

3. **Editing LaTeX**: If you need to manually adjust the generated LaTeX, use the dedicated panel in the top-right section.

4. **Viewing HTML**: The bottom-right panel shows the HTML output that can be copied or downloaded.

## Project Structure

├── components\
│   ├── common\             # Common UI components
│   │   ├── IconButton.jsx
│   │   ├── PanelContainer.jsx
│   │   └── SectionHeader.jsx
│   ├── editor\             # Editor-specific components
│   │   ├── HTMLEditorPanel.jsx
│   │   └── RawLatexOutput.jsx
│   ├── icons\              # Icon components
│   │   └── index.jsx
│   ├── layout\             # Layout components
│   │   └── Header.jsx
│   └── preview\            # Preview components
│       ├── HTMLPreview.jsx
│       └── LaTeXPreview.jsx
├── constants\              # Application constants
│   └── index.js
├── contexts\               # React contexts
│   └── LatexContext.jsx
├── hooks\                  # Custom hooks
│   ├── useClipboard.js
│   └── useLatexRenderer.js
├── utils\                  # Utility functions
│   └── latexUtils.js
└── views\                  # Main view components
    ├── HTMLView.jsx
    └── LatexView.jsx

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- KaTeX for the math rendering engine
- React and Vite for the development framework
