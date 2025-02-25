import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { ComponentPropsWithoutRef } from 'react';
import { ContentData } from '../types';

interface CodeBlockProps extends ComponentPropsWithoutRef<'code'> {
  inline?: boolean;
  codePreviewComponent?: (content: ContentData) => React.ReactNode;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ 
  inline, 
  className, 
  children, 
  codePreviewComponent,
  ...props 
}) => {
  const match = /language-(\w+)/.exec(className ?? '');
  const language = match ? match[1] : '';
  const code = String(children).replace(/\n$/, '');

  if (!inline) {
    if (language === 'mermaid' && codePreviewComponent) {
      return codePreviewComponent({
        type: 'mermaid',
        content: code,
      });
    }
    
    if ((language === 'jsx' || language === 'tsx') && codePreviewComponent) {
      return codePreviewComponent({
        type: 'react',
        content: code,
        language,
      });
    }

    return (
      <div className="!my-0 overflow-hidden rounded-lg bg-[#1a1a1a]">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          wrapLongLines
          PreTag="div"
          {...props}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  }

  return <code className={className} {...props}>{children}</code>;
};

export default CodeBlock;
