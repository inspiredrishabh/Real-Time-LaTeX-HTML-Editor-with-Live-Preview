import { useState } from "react";
import PropTypes from "prop-types";
import SectionHeader from "../common/SectionHeader";
import IconButton from "../common/IconButton";
import { CodeIcon, RefreshIcon, FullscreenIcon, CloseIcon } from "../icons";

/**
 * HTML Preview component with iframe and device frame
 */
const HTMLPreview = ({ htmlCode, onRefresh }) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    if (onRefresh) onRefresh();
  };

  return (
    <>
      <SectionHeader title="HTML Preview" icon={<CodeIcon />} className="mb-4">
        <div className="flex gap-2">
          <IconButton onClick={handleRefresh} title="Refresh preview">
            <RefreshIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </IconButton>
          <IconButton
            onClick={() => setFullScreen(!fullScreen)}
            title={fullScreen ? "Exit full screen" : "Full screen preview"}
          >
            <FullscreenIcon
              isFullScreen={fullScreen}
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
          </IconButton>
        </div>
      </SectionHeader>

      <div
        className={`flex-1 overflow-hidden ${
          fullScreen ? "fixed inset-0 z-50 bg-white p-2 sm:p-4" : "relative"
        }`}
      >
        <div className="preview-device-frame h-full">
          <div className="preview-device-header">
            <div className="preview-device-controls">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="preview-device-title">Preview</div>
          </div>
          <div className="preview-device-content p-0">
            <iframe
              key={refreshKey}
              srcDoc={htmlCode}
              title="HTML Preview"
              className="w-full h-full border-0 html-preview-iframe"
              style={{ margin: 0, padding: 0 }}
              sandbox="allow-same-origin"
            />
          </div>
        </div>

        {fullScreen && (
          <button
            onClick={() => setFullScreen(false)}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-white rounded-full shadow-md"
            title="Exit full screen"
          >
            <CloseIcon />
          </button>
        )}
      </div>
    </>
  );
};

HTMLPreview.propTypes = {
  htmlCode: PropTypes.string.isRequired,
  onRefresh: PropTypes.func,
};

export default HTMLPreview;
