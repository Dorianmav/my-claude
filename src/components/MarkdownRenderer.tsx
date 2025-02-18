import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkEmoji from 'remark-emoji';
import CodeRenderer from './CodeRenderer';

interface MarkdownRendererProps {
  content?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkEmoji]}
        className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
        components={{
          code: CodeRenderer,
          // Empêcher l'enveloppement des blocs de code dans des <p>
          pre: ({ children }) => <>{children}</>,
          // Customiser le rendu des paragraphes pour plus de contrôle
          p: ({ children, ...props }) => {
            // Vérifier si l'enfant est un bloc de code
            const isCodeBlock = React.Children.toArray(children).some(
              child => React.isValidElement(child) && child.type === CodeRenderer
            );
            
            // Si c'est un bloc de code, ne pas l'envelopper dans un <p>
            if (isCodeBlock) {
              return <>{children}</>;
            }
            
            // Sinon, rendu normal du paragraphe
            return <p {...props}>{children}</p>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
