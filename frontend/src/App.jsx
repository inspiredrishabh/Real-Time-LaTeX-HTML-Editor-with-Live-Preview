import { Routes, Route } from "react-router-dom";
import { LatexProvider } from "./contexts/LatexContext";
import Header from "./components/layout/Header";
import LatexView from "./views/LatexView";
import HTMLView from "./views/HTMLView";
import "katex/dist/katex.min.css";
import "./App.css";

/**
 * Root component with app layout and routing
 */
export default function App() {
  return (
    <LatexProvider>
      <div className="app-container min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
        {/* App Header */}
        <Header title="Math Document Generator" />

        {/* Main content */}
        <main className="flex-1 w-full flex flex-col p-2 sm:p-3 md:p-4">
          <Routes>
            <Route path="/" element={<LatexView />} />
            <Route path="/html" element={<HTMLView />} />
          </Routes>
        </main>
      </div>
    </LatexProvider>
  );
}
