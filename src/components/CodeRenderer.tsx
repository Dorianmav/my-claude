import React from 'react';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyButton from "./CoppyButton";

type CodeProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

interface CodeRendererProps extends CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CodeRenderer: React.FC<CodeRendererProps> = ({
  inline,
  className,
  children,
  ...props
}) => {
  // Si c'est du code inline, on retourne simplement un élément <code>
  if (inline) {
    return (
      <code className="px-1 py-0.5 rounded bg-gray-100 text-sm font-mono" {...props}>
        {children}
      </code>
    );
  }

  // Pour les blocs de code, on extrait le langage et on utilise SyntaxHighlighter
  const match = /language-(\w+)/.exec(className ?? '');
  const code = String(children).replace(/\n$/, '');
  const language = match ? match[1] : '';

  // Utiliser un fragment au lieu d'un div pour éviter les problèmes de nesting
  return (
    <pre className="relative group mt-4 mb-4">
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
        <CopyButton code={code} />
      </div>
      <SyntaxHighlighter
        style={vs}
        language={language}
        className="!my-0 !bg-gray-50 !rounded-lg"
        PreTag="div"
      >
        {code}
      </SyntaxHighlighter>
    </pre>
  );
};

export default CodeRenderer;
