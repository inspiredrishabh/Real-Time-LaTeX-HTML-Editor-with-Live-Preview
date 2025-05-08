import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useLatex } from "../contexts/LatexContext";
import PanelContainer from "../components/common/PanelContainer";
import HTMLPreview from "../components/preview/HTMLPreview";
import HTMLEditorPanel from "../components/editor/HTMLEditorPanel";

/**
 * HTML Preview and Editor View
 */
const HTMLView = () => {
  const { htmlCode, setHtmlCode } = useLatex();

  return (
    <PanelGroup direction="vertical" className="flex-1 min-h-0">
      {/* Top panel: HTML preview */}
      <Panel defaultSize={60} minSize={30}>
        <PanelContainer className="p-2 sm:p-3 md:p-5">
          <HTMLPreview htmlCode={htmlCode} />
        </PanelContainer>
      </Panel>

      {/* Resize handle */}
      <PanelResizeHandle className="resize-handle">
        <div className="handle-line"></div>
      </PanelResizeHandle>

      {/* Bottom panel: HTML editor */}
      <Panel minSize={30}>
        <HTMLEditorPanel htmlCode={htmlCode} onChange={setHtmlCode} />
      </Panel>
    </PanelGroup>
  );
};

export default HTMLView;
