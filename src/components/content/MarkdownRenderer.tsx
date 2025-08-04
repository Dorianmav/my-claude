import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkEmoji from 'remark-emoji';
import type { ComponentPropsWithoutRef } from 'react';
import { ContentData } from '../../types';
import CodeBlock from './CodeBlock';
import CustomParagraph from '../common/CustomParagraph';

interface MarkdownRendererProps {
  content: string;
  codePreviewComponent?: (content: ContentData) => React.ReactNode;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, codePreviewComponent }) => {
  const components: Components = {
    code: (props: ComponentPropsWithoutRef<'code'> & { inline?: boolean }) => (
      <CodeBlock {...props} codePreviewComponent={codePreviewComponent} />
    ),
    p: CustomParagraph
  };

  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkEmoji]}
        className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
