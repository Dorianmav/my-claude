import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import mermaid from "mermaid";
import { Button } from "./ui/button";
import { getFullScope } from "../utils/componentScopes";
import { PreviewComponent } from "./PreviewComponent";
import { MermaidDiagram } from "./MermaidDiagram";
import { CanvaProps, CodeRunnerProps, MermaidRendererProps, TabType } from "../types/components";
import CopyButton from "./buttons/CopyButton";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut";
import { Eye, Code2 } from "lucide-react";

// Configure mermaid with specific settings
mermaid.initialize({
  startOnLoad: true,
  theme: "default",
  securityLevel: "loose",
  fontFamily: "sans-serif",
});

const CodeRunner: React.FC<CodeRunnerProps> = ({ code, language, activeTab }) => {
  const [copyButtonRef, setCopyButtonRef] = useState<HTMLButtonElement | null>(null);

  useKeyboardShortcut('c', () => {
    copyButtonRef?.click();
  }, { ctrlKey: true });

  if (activeTab === "source") {
    return (
      <div className="relative">
        <SyntaxHighlighter
          language={language ?? "typescript"}
          style={vscDarkPlus}
          className="rounded-lg"
        >
          {String(code)}
        </SyntaxHighlighter>
        <CopyButton code={String(code)} ref={setCopyButtonRef} />
      </div>
    );
  }

  // Supprimer les imports car on fournit déjà les dépendances dans le scope
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

  useKeyboardShortcut('p', () => setActiveTab("preview"), { ctrlKey: true });
  useKeyboardShortcut('s', () => setActiveTab("source"), { ctrlKey: true });
  useKeyboardShortcut('Escape', onClose);

  if (!isShow) return null;

  const renderContent = () => {
    if (contentData.type === "mermaid") {
      return <MermaidRenderer code={contentData.content} activeTab={activeTab} />;
    }

    return (
      <CodeRunner
        code={contentData.content}
        language={contentData.language}
        activeTab={activeTab}
      />
    );
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex space-x-2">
          <Button
            onClick={() => setActiveTab("preview")}
            variant={activeTab === "preview" ? "default" : "ghost"}
            size="sm"
            className="flex items-center gap-2"
          >
            <Eye size={16} />
            Preview
          </Button>
          <Button
            onClick={() => setActiveTab("source")}
            variant={activeTab === "source" ? "default" : "ghost"}
            size="sm"
            className="flex items-center gap-2"
          >
            <Code2 size={16} />
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
