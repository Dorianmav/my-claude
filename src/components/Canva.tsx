import React, { useState } from 'react';
import { ContentData } from '../types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Runner } from 'react-runner';
import mermaid from 'mermaid';

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

  // Log pour debug
  console.log('Code original:', code);

  // Supprimer les imports car on fournit déjà les dépendances dans le scope
  const codeWithoutImports = code.replace(/import.*?;(\n|$)/g, '').trim();

  // Configurer le scope minimal
  const scope = {
    React,
    Fragment: React.Fragment,
    useState: React.useState,
  };

  // Log pour debug
  console.log('Code sans imports:', codeWithoutImports);
  console.log('Scope configuré:', Object.keys(scope));

  try {
    // Vérifier si le code a un export default
    let finalCode = codeWithoutImports;
    if (!finalCode.includes('export default')) {
      const matches = finalCode.match(/(?:function|const)\s+(\w+)/);
      const componentName = matches ? matches[1] : 'Component';
      finalCode = `${finalCode}\n\nexport default ${componentName};`;
    }

    // Log pour debug
    console.log('Code final:', finalCode);

    return (
      <ErrorBoundary>
        <div className="bg-white rounded-lg">
          <Runner
            code={finalCode}
            scope={scope}
          />
        </div>
      </ErrorBoundary>
    );
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 h-5/6 overflow-hidden flex flex-col relative">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded ${
                activeTab === 'preview'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab('source')}
              className={`px-4 py-2 rounded ${
                activeTab === 'source'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600'
              }`}
            >
              Source
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
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
    </div>
  );
};
