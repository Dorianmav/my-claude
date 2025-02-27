import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import mermaid from "mermaid";
import { Button } from "./ui/button";
import { getFullScope } from "../utils/componentScopes";
import { PreviewComponent } from "./PreviewComponent";
import { MermaidDiagram } from "./MermaidDiagram";
import { CanvaProps, CodeRunnerProps, MermaidRendererProps, TabType } from "../types/components";

// Configure mermaid with specific settings
mermaid.initialize({
  startOnLoad: true,
  theme: "default",
  securityLevel: "loose",
  fontFamily: "sans-serif",
});

const CodeRunner: React.FC<CodeRunnerProps> = ({ code, language, activeTab }) => {
  if (activeTab === "source") {
    return (
      <SyntaxHighlighter
        language={language ?? "typescript"}
        style={vscDarkPlus}
        className="rounded-lg"
      >
        {String(code)}
      </SyntaxHighlighter>
    );
  }

  const codeWithoutImports = String(code)
    .replace(/import.*?;(\n|$)/g, "")
    .trim();

  return (
    <PreviewComponent
      code={codeWithoutImports}
      scope={getFullScope()}
    />
  );
};

const MermaidRenderer: React.FC<MermaidRendererProps> = ({ code, activeTab }) => {
  if (activeTab === "source") {
    return (
      <div className="p-4">
        <pre className="whitespace-pre-wrap">{code}</pre>
      </div>
    );
  }

  return <MermaidDiagram code={code as string} />;
};

export const Canva: React.FC<CanvaProps> = ({ isShow, contentData, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>("preview");

  if (!isShow) return null;

  const renderContent = () => {
    switch (contentData.type) {
      case "mermaid":
        return <MermaidRenderer code={contentData.content} activeTab={activeTab} />;
      default:
        return (
          <CodeRunner
            code={contentData.content}
            language={contentData.language}
            activeTab={activeTab}
          />
        );
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex space-x-2">
          <Button
            onClick={() => setActiveTab("preview")}
            variant={activeTab === "preview" ? "default" : "ghost"}
            size="sm"
          >
            Preview
          </Button>
          <Button
            onClick={() => setActiveTab("source")}
            variant={activeTab === "source" ? "default" : "ghost"}
            size="sm"
          >
            Source
          </Button>
        </div>
        <Button onClick={onClose} variant="ghost" size="icon">
          ✕
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-4">{renderContent()}</div>
    </div>
  );
};
