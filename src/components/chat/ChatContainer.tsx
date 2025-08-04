import React, { useState } from 'react';
import { ChatProps, Message } from '../../types/chat';
import { useChatHistory } from '../../hooks/useChatHistory';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { useGroqChat } from '../../hooks/useGroqChat';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Button } from '../ui/button';
import * as LucideReact from 'lucide-react';

export const ChatContainer: React.FC<ChatProps> = ({ onContentGenerated }) => {
  const [inputText, setInputText] = useState("");
  const { messages, addMessage, updateLastMessage, clearHistory } = useChatHistory();
  const { contentRef } = useAutoScroll(messages);
  
  const { isLoading, sendMessage } = useGroqChat(
    onContentGenerated,
    updateLastMessage
  );

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: inputText,
      timestamp: new Date().toISOString(),
    };

    setInputText(""); // Reset input immediately for better UX
    addMessage(userMessage);

    const systemMessage: Message = {
      role: "system",
      content: `INSTRUCTIONS STRICTES - À RESPECTER ABSOLUMENT :

1. MERMAID - RÈGLES STRICTES :
   - Si ta réponse contient un diagramme Mermaid :
   - D'abord le diagramme Mermaid dans un bloc de code \`\`\`mermaid
   - Puis une explication claire et détaillée du diagramme

2. COMPOSANTS REACT - RÈGLES STRICTES :
   - Fournis UNIQUEMENT le code du composant
   - INTERDICTION ABSOLUE d'inclure des exemples d'utilisation
   - INTERDICTION ABSOLUE de phrases comme "Vous pouvez utiliser ce composant comme suit"
   - INTERDICTION ABSOLUE de code montrant comment utiliser le composant
   - INTERDICTION ABSOLUE d'exemples d'intégration
   - Donne SEULEMENT : le code du composant + les imports + l'explication
   - ARRÊTE-TOI après l'explication du composant

3. GRAPHIQUES - RÈGLES STRICTES :
   - INTERDICTION ABSOLUE d'inclure des exemples d'utilisation
   - INTERDICTION ABSOLUE de phrases comme "Vous pouvez utiliser ce composant comme suit"
   - INTERDICTION ABSOLUE de code montrant comment utiliser le composant
   - INTERDICTION ABSOLUE d'exemples d'intégration
   - Utilise EXCLUSIVEMENT Recharts
   - Code du composant + imports Recharts uniquement

4. LANGUE : Français obligatoire

CES RÈGLES SONT NON-NÉGOCIABLES. RESPECTE-LES STRICTEMENT.`,
      timestamp: new Date().toISOString(),
    };
    addMessage(systemMessage);

    // Ajouter un message assistant vide pour le streaming
    const assistantMessage: Message = {
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
    };
    addMessage(assistantMessage);

    try {
      await sendMessage([...messages, userMessage]);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      // Optionnel: Afficher un message d'erreur à l'utilisateur
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">PpLG</h2>
            <p className="text-slate-600 mt-1">Powered by Groq AI</p>
          </div>
          <Button
            onClick={clearHistory}
            variant="secondary"
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <LucideReact.Trash2 className="w-4 h-4" />
            Clear History
          </Button>
        </div>
      </div>

      {/* Messages List */}
      <MessageList
        messages={messages}
        onContentGenerated={onContentGenerated}
        contentRef={contentRef}
      />

      {/* Input Area */}
      <MessageInput
        inputText={inputText}
        setInputText={setInputText}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};