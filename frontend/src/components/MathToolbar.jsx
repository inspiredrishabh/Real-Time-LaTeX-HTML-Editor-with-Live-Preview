import { useState } from 'react';
import 'katex/dist/katex.min.css';

export default function MathToolbar({ onInsertSymbol }) {
  const [activeCategory, setActiveCategory] = useState('basic');

  // Rich set of symbols with rendered preview
  const symbolCategories = {
    basic: [
      { tex: '+', display: '+' },
      { tex: '-', display: '-' },
      { tex: '\\times', display: '×' },
      { tex: '\\div', display: '÷' },
      { tex: '=', display: '=' },
      { tex: '\\neq', display: '≠' },
      { tex: '<', display: '<' },
      { tex: '>', display: '>' },
      { tex: '\\leq', display: '≤' },
      { tex: '\\geq', display: '≥' },
      { tex: '\\approx', display: '≈' },
    ],
    greek: [
      { tex: '\\alpha', display: 'α' },
      { tex: '\\beta', display: 'β' },
      { tex: '\\gamma', display: 'γ' },
      { tex: '\\delta', display: 'δ' },
      { tex: '\\epsilon', display: 'ε' },
      { tex: '\\theta', display: 'θ' },
      { tex: '\\lambda', display: 'λ' },
      { tex: '\\mu', display: 'μ' },
      { tex: '\\pi', display: 'π' },
      { tex: '\\rho', display: 'ρ' },
      { tex: '\\sigma', display: 'σ' },
      { tex: '\\phi', display: 'φ' },
      { tex: '\\omega', display: 'ω' },
      { tex: '\\Sigma', display: 'Σ' },
      { tex: '\\Pi', display: 'Π' },
      { tex: '\\Omega', display: 'Ω' },
    ],
    functions: [
      { tex: '\\frac{a}{b}', display: '𝑎/𝑏' },
      { tex: '\\sqrt{x}', display: '√𝑥' },
      { tex: '\\sqrt[n]{x}', display: '∛𝑥' },
      { tex: '\\int_{a}^{b}', display: '∫' },
      { tex: '\\sum_{i=1}^{n}', display: 'Σ' },
      { tex: '\\prod_{i=1}^{n}', display: 'Π' },
      { tex: '\\lim_{x \\to 0}', display: 'lim' },
    ],
    sets: [
      { tex: '\\in', display: '∈' },
      { tex: '\\notin', display: '∉' },
      { tex: '\\subset', display: '⊂' },
      { tex: '\\supset', display: '⊃' },
      { tex: '\\subseteq', display: '⊆' },
      { tex: '\\supseteq', display: '⊇' },
      { tex: '\\cup', display: '∪' },
      { tex: '\\cap', display: '∩' },
      { tex: '\\emptyset', display: 'Ø' },
      { tex: '\\mathbb{N}', display: 'ℕ' },
      { tex: '\\mathbb{Z}', display: 'ℤ' },
      { tex: '\\mathbb{Q}', display: 'ℚ' },
      { tex: '\\mathbb{R}', display: 'ℝ' },
    ],
    arrows: [
      { tex: '\\rightarrow', display: '→' },
      { tex: '\\leftarrow', display: '←' },
      { tex: '\\Rightarrow', display: '⇒' },
      { tex: '\\Leftarrow', display: '⇐' },
      { tex: '\\leftrightarrow', display: '↔' },
      { tex: '\\Leftrightarrow', display: '⇔' },
    ]
  };

  return (
    <div className="mb-3">
      {/* Category tabs */}
      <div className="flex border-b">
        {Object.keys(symbolCategories).map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-3 py-2 ${activeCategory === category 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-600 hover:text-blue-500'}`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Symbols grid */}
      <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-1 p-2 bg-gray-50 rounded border-x border-b">
        {symbolCategories[activeCategory].map((symbol, idx) => (
          <button
            key={idx}
            onClick={() => onInsertSymbol(symbol.tex)}
            className="flex items-center justify-center p-2 h-9 border rounded hover:bg-blue-100 hover:border-blue-300 symbol-button"
            title={symbol.tex}
          >
            <span>{symbol.display}</span>
          </button>
        ))}
      </div>
    </div>
  );
}