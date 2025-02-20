import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkEmoji from 'remark-emoji';
import CodeRenderer from './CodeRenderer';

interface CustomParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

const CustomParagraph: React.FC<CustomParagraphProps> = ({ children, ...props }) => {
  // Vérifier si le paragraphe contient du code
  const hasCodeElement = React.Children.toArray(children).some(
    child => 
      React.isValidElement(child) && 
      (child.type === 'pre' || child.type === 'div' || 
      (typeof child.type === 'function' && child.type.name === 'CodeRenderer'))
  );

  // Si le paragraphe contient du code, utiliser un div
  if (hasCodeElement) {
    return <div className="my-4">{children}</div>;
  }

  // Sinon, utiliser un paragraphe normal
  return <p {...props}>{children}</p>;
};

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
          p: CustomParagraph
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
