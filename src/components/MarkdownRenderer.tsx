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
          // Utiliser un div au lieu d'un p pour les paragraphes contenant du code
          p: ({ children, ...props }) => {
            const hasPreTag = React.Children.toArray(children).some(
              child => React.isValidElement(child) && child.type === 'pre'
            );
            if (hasPreTag) {
              return <div {...props}>{children}</div>;
            }
            return <p {...props}>{children}</p>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
