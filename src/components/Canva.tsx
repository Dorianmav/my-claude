import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { ContentData } from "../types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Runner } from "react-runner";
import * as Recharts from "recharts";
import * as LucideReact from "lucide-react";
import mermaid from "mermaid";

interface CodeRunnerProps {
  code: string | React.ReactNode;
  language?: string;
  activeTab: "source" | "preview";
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

interface PreviewComponentProps {
  code: string;
  scope: Record<string, unknown>;
}

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
              ResponsiveContainer: Recharts.ResponsiveContainer,
              LineChart: Recharts.LineChart,
              BarChart: Recharts.BarChart,
              PieChart: Recharts.PieChart,
              ScatterChart: Recharts.ScatterChart,
              RadialBarChart: Recharts.RadialBarChart,
              AreaChart: Recharts.AreaChart,
              ComposedChart: Recharts.ComposedChart,
              RadarChart: Recharts.RadarChart,
              Line: Recharts.Line,
              Bar: Recharts.Bar,
              Pie: Recharts.Pie,
              Scatter: Recharts.Scatter,
              RadialBar: Recharts.RadialBar,
              Area: Recharts.Area,
              Radar: Recharts.Radar,
              XAxis: Recharts.XAxis,
              YAxis: Recharts.YAxis,
              Tooltip: Recharts.Tooltip,
              Legend: Recharts.Legend,
              Cell: Recharts.Cell,
              Sector: Recharts.Sector,
              CartesianGrid: Recharts.CartesianGrid,
              PolarGrid: Recharts.PolarGrid,
              PolarAngleAxis: Recharts.PolarAngleAxis,
              PolarRadiusAxis: Recharts.PolarRadiusAxis,
              Surface: Recharts.Surface,
              Symbols: Recharts.Symbols,
              console: console,
            }}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

// TailwindWrapper component for applying Tailwind styles
const TailwindWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={className}>{children}</div>
);

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

  // Définir le scope avec les dépendances de base nécessaires
  const scope = {
    React,
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
    ...LucideReact, // All Lucide icons and components
    // Ajouter une fonction pour créer des éléments stylisés avec Tailwind
    tw: (className: string) => ({ className }),
    // Use the TailwindWrapper component from the outer scope
    TailwindWrapper,
  };

  try {
    // Vérifier si le code a un export default
    let finalCode = codeWithoutImports;
    if (!finalCode.includes("export default")) {
      const regex = /(?:function|const)\s+(\w+)/;
      const matches = regex.exec(finalCode);
      const componentName = matches ? matches[1] : "Component";
      finalCode = `${finalCode}\n\nexport default ${componentName};`;
    }

    return <PreviewComponent code={finalCode} scope={scope} />;
  } catch (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg">
        <h3 className="font-semibold mb-2">Error processing code:</h3>
        <pre className="text-sm">{String(error)}</pre>
      </div>
    );
  }
};

interface MermaidRendererProps {
  code: string | React.ReactNode;
  activeTab: "source" | "preview";
}

const MermaidRenderer: React.FC<MermaidRendererProps> = ({
  code,
  activeTab,
}) => {
  const mermaidRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (activeTab === "preview" && mermaidRef.current) {
      mermaid.run({
        nodes: [mermaidRef.current],
      });
    }
  }, [activeTab, code]);

  if (activeTab === "source") {
    return (
      <SyntaxHighlighter language="mermaid" style={vscDarkPlus}>
        {String(code)}
      </SyntaxHighlighter>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div ref={mermaidRef} className="mermaid">
        {String(code)}
      </div>
    </div>
  );
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
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "preview"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab("source")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "source"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Source
          </button>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100"
        >
          ✕
        </button>
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
