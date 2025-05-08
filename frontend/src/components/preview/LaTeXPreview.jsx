import PropTypes from "prop-types";
import SectionHeader from "../common/SectionHeader";
import { DocumentIcon } from "../icons";

/**
 * LaTeX Preview component that renders mathematical expressions
 */
const LaTeXPreview = ({ renderedLatex }) => {
  return (
    <>
      <SectionHeader
        title="LaTeX Preview"
        icon={<DocumentIcon />}
        className="mb-4"
      />

      <div className="flex-1 flex flex-col overflow-auto">
        <div className="p-3 sm:p-4 md:p-5 flex-1 flex items-center justify-center">
          <div
            className="latex-preview-container w-full overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: renderedLatex }}
          />
        </div>
      </div>
    </>
  );
};

LaTeXPreview.propTypes = {
  renderedLatex: PropTypes.string.isRequired,
};

export default LaTeXPreview;
