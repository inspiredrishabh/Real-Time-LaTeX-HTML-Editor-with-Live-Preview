export default function MathToolbar({ onInsertSymbol }) {
    const symbols = {
      basic: ['+', '-', '×', '÷', '=', '≠', '<', '>', '≤', '≥'],
      greek: ['\\alpha', '\\beta', '\\gamma', '\\theta', '\\pi', '\\Sigma', '\\Delta'],
      math: ['\\frac{a}{b}', '\\sqrt{x}', '\\int_{a}^{b}', '\\sum_{i=1}^{n}', '\\lim_{x \\to 0}']
    };
  
    return (
      <div className="flex flex-wrap gap-1 mb-2 p-2 border rounded bg-gray-50">
        {Object.entries(symbols).map(([category, list]) => (
          <div key={category} className="mr-4">
            <div className="text-xs text-gray-500">{category}</div>
            <div className="flex flex-wrap gap-1">
              {list.map((symbol, index) => (
                <button
                  key={index}
                  onClick={() => onInsertSymbol(symbol)}
                  className="px-2 py-1 text-sm border rounded hover:bg-blue-100"
                >
                  {symbol.length > 10 ? symbol.slice(0, 10) + '...' : symbol}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }