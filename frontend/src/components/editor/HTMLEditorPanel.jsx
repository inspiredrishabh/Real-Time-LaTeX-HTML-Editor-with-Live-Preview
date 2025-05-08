import PropTypes from "prop-types";
import HTMLPanel from "../HTMLPanel";
import PanelContainer from "../common/PanelContainer";

/**
 * Wrapper component for the HTML editor panel
 */
const HTMLEditorPanel = ({ htmlCode, onChange }) => {
  return (
    <PanelContainer className="p-2 sm:p-3 md:p-5">
      <HTMLPanel htmlCode={htmlCode} onChange={onChange} />
    </PanelContainer>
  );
};

HTMLEditorPanel.propTypes = {
  htmlCode: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default HTMLEditorPanel;
