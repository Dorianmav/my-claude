import React, { memo } from 'react';
import { Message } from '../../types/chat';
import { ContentData } from '../../types/content';
import { MarkdownRenderer } from '../content/MarkdownRenderer';
import { PreviewWrapper } from './PreviewWrapper';

interface MessageItemProps {
  message: Message;
  index: number;
  onContentGenerated: (data: ContentData) => void;
}

export const MessageItem: React.FC<MessageItemProps> = memo(({ 
  message, 
  index, 
  onContentGenerated 
}) => {
  const renderPreviewComponent = (content: ContentData) => (
    <PreviewWrapper
      content={content}
      onContentGenerated={onContentGenerated}
    />
  );

  const messageClassName = message.role === "user" 
    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg" 
    : "bg-white text-slate-800 shadow-md";

  return (
    <div
      key={`${message.timestamp}-${index}`}
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
    >
      <div
        className={`max-w-[80%] rounded-2xl p-4 ${messageClassName} transition-all duration-200 hover:shadow-xl`}
      >
        {message.role === "assistant" ? (
          <div className="prose prose-sm max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-blue-600 hover:prose-a:text-blue-500">
            <MarkdownRenderer 
              content={message.content}
              codePreviewComponent={renderPreviewComponent}
            />
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{message.content}</div>
        )}
      </div>
    </div>
  );
});