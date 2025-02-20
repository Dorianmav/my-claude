import React, { useState } from 'react';
import { ContentData } from '../types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Runner } from 'react-runner';
import mermaid from 'mermaid';
import * as Recharts from 'recharts';
import * as LucideReact from 'lucide-react';

interface CodeRunnerProps {
  code: string | React.ReactNode;
  language?: string;
  activeTab: 'source' | 'preview';
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
    console.error('ErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {this.state.error?.message}
        </div>
      );
    }

    return this.props.children;
  }
}

const CodeRunner: React.FC<CodeRunnerProps> = ({ code, language, activeTab }) => {
  // Afficher le code source
  if (activeTab === 'source' || typeof code !== 'string') {
    return (
      <SyntaxHighlighter 
        language={language ?? 'typescript'} 
        style={vscDarkPlus}
        className="rounded-lg"
      >
        {String(code)}
      </SyntaxHighlighter>
    );
  }

  // Supprimer les imports car on fournit déjà les dépendances dans le scope
  const codeWithoutImports = code.replace(/import.*?;(\n|$)/g, '').trim();

  // Configurer le scope minimal
  const scope = {
    React,
    ...React,  // Spread all React exports including hooks
    Fragment: React.Fragment,
    useState: React.useState,
    useEffect: React.useEffect,
    useRef: React.useRef,
    useCallback: React.useCallback,
    useMemo: React.useMemo,
    ...Recharts,  // All Recharts components and utilities
    ...LucideReact,  // All Lucide icons and components
  };

  try {
    // Vérifier si le code a un export default
    let finalCode = codeWithoutImports;
    if (!finalCode.includes('export default')) {
      const matches = finalCode.match(/(?:function|const)\s+(\w+)/);
      const componentName = matches ? matches[1] : 'Component';
      finalCode = `${finalCode}\n\nexport default ${componentName};`;
    }

    const RunnerComponent = () => {
      return (
        <ErrorBoundary>
          <div 
            className="bg-white rounded-lg p-4" 
            style={{ width: '100%', height: '400px' }}
          >
            <Runner
              code={finalCode}
              scope={scope}
            />
          </div>
        </ErrorBoundary>
      );
    };

    return <RunnerComponent />;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Erreur dans CodeRunner:', errorMessage);
    return <div className="p-4 bg-red-100 text-red-700 rounded">{errorMessage}</div>;
  }
};

interface MermaidRendererProps {
  code: string | React.ReactNode;
  activeTab: 'source' | 'preview';
}

const MermaidRenderer: React.FC<MermaidRendererProps> = ({ code, activeTab }) => {
  const mermaidRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (activeTab === 'preview' && mermaidRef.current) {
      mermaid.init(undefined, mermaidRef.current);
    }
  }, [activeTab, code]);

  const codeString = typeof code === 'string' ? code : '';

  if (activeTab === 'source') {
    return (
      <SyntaxHighlighter language="mermaid" style={vscDarkPlus}>
        {codeString}
      </SyntaxHighlighter>
    );
  }

  return (
    <div className="mermaid" ref={mermaidRef}>
      {codeString}
    </div>
  );
};

interface CanvaProps {
  isShow: boolean;
  onClose: () => void;
  contentData: ContentData;
}

// Initialize mermaid with specific configuration
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'monospace',
});

export const Canva: React.FC<CanvaProps> = ({ isShow, contentData, onClose }) => {
  const [activeTab, setActiveTab] = useState<'source' | 'preview'>('preview');

  if (!isShow) return null;

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'preview'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('source')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'source'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100'
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
        {contentData.type === 'mermaid' ? (
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
