import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { convertToLatex, convertToHTML } from "../utils/converters";
import { useLatexRenderer } from "../hooks/useLatexRenderer";
import { extractLatexContent } from "../utils/latexUtils";
import { DEFAULT_EXPRESSION } from "../constants";

// Create the context
const LatexContext = createContext();

/**
 * LatexProvider component for managing application state
 */
export const LatexProvider = ({ children }) => {
  // Core state
  const [question, setQuestion] = useState(DEFAULT_EXPRESSION);
  const [latexCode, setLatexCode] = useState("");
  const [htmlCode, setHtmlCode] = useState("");

  // Generate LaTeX when question changes
  useEffect(() => {
    const latex = convertToLatex(question);
    setLatexCode(latex);
  }, [question]);

  // Generate HTML when LaTeX changes
  useEffect(() => {
    const html = convertToHTML(latexCode);
    setHtmlCode(html);
  }, [latexCode]);

  // Extract and render LaTeX content
  const latexContent = extractLatexContent(latexCode);
  const renderedLatex = useLatexRenderer(latexContent);

  // Exposed context value
  const contextValue = {
    // State
    question,
    setQuestion,
    latexCode,
    setLatexCode,
    htmlCode,
    setHtmlCode,
    renderedLatex,

    // Helper functions
    extractLatexContent,
  };

  return (
    <LatexContext.Provider value={contextValue}>
      {children}
    </LatexContext.Provider>
  );
};

LatexProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook for accessing LaTeX context
 */
export const useLatex = () => {
  const context = useContext(LatexContext);
  if (!context) {
    throw new Error("useLatex must be used within a LatexProvider");
  }
  return context;
};
