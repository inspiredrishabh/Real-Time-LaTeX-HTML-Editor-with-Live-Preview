import { useState, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import MathEditor from './components/MathEditor';
import LaTeXPanel from './components/LaTeXPanel';
import HTMLPanel from './components/HTMLPanel';
import { convertToLatex, convertToHTML } from './utils/converters';
import './App.css';

export default function App() {
  const [question, setQuestion] = useState('E = mc^2');
  const [latexCode, setLatexCode] = useState('');
  const [htmlCode, setHtmlCode] = useState('');

  useEffect(() => {
    const latex = convertToLatex(question);
    setLatexCode(latex);
  }, [question]);

  useEffect(() => {
    const html = convertToHTML(latexCode);
    setHtmlCode(html);
  }, [latexCode]);

  return (
    <div className="app-container h-screen bg-gray-100">
      <div className="bg-blue-700 text-white p-3 text-center">
        <h1 className="text-xl font-bold">Math Document Generator</h1>
      </div>
      
      <div className="h-[calc(100vh-56px)]">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={40} minSize={20}>
            <div className="h-full bg-white p-4 overflow-auto">
              <h2 className="text-lg font-bold mb-3">Write Question Here</h2>
              <MathEditor value={question} onChange={setQuestion} />
              
              <div className="mt-4">
                <div className="p-3 border rounded shadow-sm bg-gray-50">
                  <h3 className="font-medium text-gray-700">LaTeX Preview</h3>
                  <div className="mt-2 p-2 bg-white rounded">
                    {latexCode.split('\\begin{document}')[1]?.split('\\end{document}')[0] || ''}
                  </div>
                </div>
                
                <div className="p-3 border rounded shadow-sm bg-gray-50 mt-4">
                  <h3 className="font-medium text-gray-700">HTML Preview</h3>
                  <div 
                    className="mt-2 p-2 bg-white rounded"
                    dangerouslySetInnerHTML={{ __html: htmlCode }}
                  />
                </div>
              </div>
            </div>
          </Panel>
          
          <PanelResizeHandle className="resize-handle">
            <div className="handle-line"></div>
          </PanelResizeHandle>
          
          <Panel>
            <PanelGroup direction="vertical">
              <Panel defaultSize={50} minSize={20}>
                <LaTeXPanel latexCode={latexCode} onChange={setLatexCode} />
              </Panel>
              
              <PanelResizeHandle className="resize-handle">
                <div className="handle-line"></div>
              </PanelResizeHandle>
              
              <Panel>
                <HTMLPanel htmlCode={htmlCode} onChange={setHtmlCode} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}