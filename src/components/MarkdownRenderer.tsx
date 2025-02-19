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
          code: CodeRenderer
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
