import React from 'react';
import { Message } from '../../types/chat';
import { ContentData } from '../../types/content';
import { MessageItem } from './MessageItem';

interface MessageListProps {
  messages: Message[];
  onContentGenerated: (data: ContentData) => void;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

export const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  onContentGenerated, 
  contentRef 
}) => {
  return (
    <div className="flex-1 relative bg-slate-50 bg-opacity-50">
      {/* Scrollable Messages Area */}
      <div 
        ref={contentRef} 
        className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
      >
        <div className="p-6 space-y-6">
          {messages
            .filter((message: Message) => message.role !== "system")
            .map((message: Message, index: number) => (
              <MessageItem
                key={`${message.timestamp}-${index}`}
                message={message}
                index={index}
                onContentGenerated={onContentGenerated}
              />
            ))}
        </div>
      </div>
    </div>
  );
};