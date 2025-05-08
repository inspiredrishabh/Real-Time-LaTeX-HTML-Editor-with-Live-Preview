import { useState } from "react";

/**
 * Custom hook for clipboard operations
 *
 * @returns {Object} Object containing copy function and copy status
 */
export const useClipboard = () => {
  const [copyStatus, setCopyStatus] = useState("");

  /**
   * Copy text to clipboard with status handling
   *
   * @param {string} text - Text to copy to clipboard
   * @param {number} [timeout=2000] - How long to show the status message
   * @param {string} [successMessage='Copied!'] - Message to show on success
   */
  const copyToClipboard = async (
    text,
    timeout = 2000,
    successMessage = "Copied!"
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(successMessage);

      const timer = setTimeout(() => {
        setCopyStatus("");
      }, timeout);

      // Cleanup timer if component unmounts
      return () => clearTimeout(timer);
    } catch (err) {
      console.error("Copy failed:", err);
      setCopyStatus("Failed to copy");

      setTimeout(() => {
        setCopyStatus("");
      }, timeout);
    }
  };

  return { copyToClipboard, copyStatus };
};
