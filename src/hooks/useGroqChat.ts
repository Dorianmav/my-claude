import { useState } from 'react';
import { Message } from '../types/chat';
import { groqService } from '../services/groq/GroqService';
import { contentProcessorService } from '../services/content/ContentProcessorService';
import { ContentData } from '../types/content';

export const useGroqChat = (
  onContentGenerated: (data: ContentData) => void,
  onMessageUpdate: (content: string) => void
) => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (messages: Message[]) => {
    setIsLoading(true);

    try {
      const chatCompletion = await groqService.sendMessage(messages);
      let fullResponse = "";

      // Traitement du streaming
      for await (const chunk of chatCompletion) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          onMessageUpdate(fullResponse);
        }
      }

      // Traitement du contenu pour extraire React/Mermaid
      contentProcessorService.processMessageForContent(
        fullResponse,
        onContentGenerated
      );

      return fullResponse;
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    sendMessage,
  };
};