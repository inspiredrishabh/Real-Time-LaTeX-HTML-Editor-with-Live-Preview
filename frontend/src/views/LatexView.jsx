import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useLatex } from "../contexts/LatexContext";
import MathEditor from "../components/MathEditor";
import PanelContainer from "../components/common/PanelContainer";
import SectionHeader from "../components/common/SectionHeader";
import RawLatexOutput from "../components/editor/RawLatexOutput";
import LaTeXPreview from "../components/preview/LaTeXPreview";
import { CodeIcon } from "../components/icons";

/**
 * LaTeX Editor and Preview View
 */
const LatexView = () => {
  const { question, setQuestion, renderedLatex, latexCode } = useLatex();

  return (
    <PanelGroup direction="horizontal" className="flex-1 min-h-0">
      {/* Left Panel: Input Editor */}
      <Panel defaultSize={50} minSize={30} className="min-w-[260px]">
        <PanelContainer className="p-2 sm:p-3 md:p-5 gap-2 sm:gap-3 md:gap-5 overflow-auto">
          <SectionHeader title="Write Your Expression" icon={<CodeIcon />} />

          <div className="flex-1 flex flex-col">
            <MathEditor value={question} onChange={setQuestion} />
          </div>

          <RawLatexOutput latexCode={latexCode} />
        </PanelContainer>
      </Panel>

      {/* Resize handle */}
      <PanelResizeHandle className="resize-handle">
        <div className="handle-line"></div>
      </PanelResizeHandle>

      {/* Right Panel: LaTeX Preview */}
      <Panel minSize={40}>
        <PanelContainer className="p-2 sm:p-3 md:p-5">
          <LaTeXPreview renderedLatex={renderedLatex} />
        </PanelContainer>
      </Panel>
    </PanelGroup>
  );
};

export default LatexView;
