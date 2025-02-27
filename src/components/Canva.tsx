import React, { useState } from "react";
import { ContentData } from "../types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Runner } from "react-runner";
import mermaid from "mermaid";
import MermaidDiagram from './MermaidDiagram';
import { Button } from "./ui/button";
import { getFullScope } from "../utils/componentScopes";

interface CodeRunnerProps {
  code: string | React.ReactNode;
  language?: string;
  activeTab: "source" | "preview";
}

interface PreviewComponentProps {
  code: string;
  scope: Record<string, unknown>;
}

// Composant ErrorBoundary pour gérer les erreurs de rendu
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-600 bg-red-50 rounded-lg">
          <h3 className="font-semibold mb-2">Error rendering component:</h3>
          <pre className="text-sm">{this.state.error?.message}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

// Déplacer PreviewComponent en dehors du composant parent
const PreviewComponent: React.FC<PreviewComponentProps> = ({ code, scope }) => {
  // Supprimer les imports et logger le code modifié
  const modifiedCode = code.replace(/import[\s\S]*?from.*?;(\n|$)/g, "").trim();

  // Détecter si le code contient un graphique Recharts
  const hasRechartsChart = /(\w+Chart|Pie)\s+data=/.test(modifiedCode);

  // Si c'est un graphique Recharts, l'encapsuler dans un ResponsiveContainer
  let finalCode = modifiedCode;
  if (hasRechartsChart && !modifiedCode.includes('ResponsiveContainer')) {
    // Trouver le return statement
    const returnMatch = (/return\s*\(([\s\S]*?)\);/).exec(modifiedCode);
    if (returnMatch) {
      const chartJSX = returnMatch[1];
      finalCode = modifiedCode.replace(
        /return\s*\(([\s\S]*?)\);/,
        `return (
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              ${chartJSX}
            </ResponsiveContainer>
          </div>
        );`
      );
    }
  }

  return (
    <ErrorBoundary>
      <div
        className="w-full h-full flex items-center justify-center bg-white p-4 rounded-lg"
        style={{ width: "100%", height: "400px" }}
      >
        <div className="w-full h-full" style={{ minHeight: "300px" }}>
          <style>
            {`
              @tailwind base;
              @tailwind components;
              @tailwind utilities;
            `}
          </style>
          <Runner
            code={finalCode}
            scope={{
              ...scope,
              ...getFullScope(),
            }}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

const CodeRunner: React.FC<CodeRunnerProps> = ({
  code,
  language,
  activeTab,
}) => {
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

interface MermaidRendererProps {
  code: string | React.ReactNode;
  activeTab: "source" | "preview";
}

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

interface CanvaProps {
  isShow: boolean;
  onClose: () => void;
  contentData: ContentData;
}

// Configure mermaid with specific settings
mermaid.initialize({
  startOnLoad: true,
  theme: "default",
  securityLevel: "loose",
  fontFamily: "sans-serif",
});

export const Canva: React.FC<CanvaProps> = ({
  isShow,
  contentData,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"source" | "preview">("preview");

  if (!isShow) return null;

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
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
        >
          ✕
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {contentData.type === "mermaid" ? (
          <MermaidRenderer code={contentData.content} activeTab={activeTab} />
        ) : (
          <CodeRunner
            code={contentData.content}
            language={contentData.language}
            activeTab={activeTab}
          />
        )}
      </div>
    </div>
  );
};
