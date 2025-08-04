import { useState, useEffect } from 'react';
import { Message } from '../types/chat';
import { storageService } from '../services/storage/StorageService';

export const useChatHistory = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    return storageService.getChatHistory();
  });

  // Sauvegarde automatique à chaque changement
  useEffect(() => {
    storageService.saveChatHistory(messages);
  }, [messages]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const updateLastMessage = (content: string) => {
    setMessages(prev => {
      const newMessages = [...prev];
      if (newMessages.length > 0) {
        newMessages[newMessages.length - 1] = {
          ...newMessages[newMessages.length - 1],
          content,
        };
      }
      return newMessages;
    });
  };

  const clearHistory = () => {
    setMessages([]);
    storageService.clearChatHistory();
  };

  return {
    messages,
    addMessage,
    updateLastMessage,
    clearHistory,
  };
};