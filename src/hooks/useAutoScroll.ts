import { useRef, useEffect } from 'react';
import { Message } from '../types/chat';

export const useAutoScroll = (messages: Message[]) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (contentRef.current) {
      const isAtBottom = 
        contentRef.current.scrollHeight - contentRef.current.scrollTop <= 
        contentRef.current.clientHeight + 100;
      
      if (isAtBottom) {
        contentRef.current.scrollTop = contentRef.current.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return {
    contentRef,
    scrollToBottom,
  };
};