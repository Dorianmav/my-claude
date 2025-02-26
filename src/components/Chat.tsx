import React, { useEffect, useRef, useState, KeyboardEvent, useCallback } from "react";
import Groq from "groq-sdk";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ContentData } from '../types';
import CodePreview from './CodePreview';
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

interface ChatProps {
  onContentGenerated: (data: ContentData) => void;
}

interface PreviewWrapperProps {
  content: ContentData;
  onContentGenerated: (data: ContentData) => void;
}

const groq = new Groq({
  apiKey: import.meta.env.VITE_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const PreviewWrapper: React.FC<PreviewWrapperProps> = ({ content, onContentGenerated }) => (
  <CodePreview 
    content={content} 
    onOpenCanvas={() => onContentGenerated(content)} 
  />
);

export const Chat: React.FC<ChatProps> = ({ onContentGenerated }) => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("chatHistory");
    const systemMessage: Message = {
      role: "system",
      content: `Pour toute visualisation de données ou graphiques :
      1. Utilisez TOUJOURS la librairie recharts (https://recharts.org/). C'est une exigence obligatoire.
      2. Utilisez TOUJOURS les composants de @shadcn/ui/chart.
      3. Utilisez TOUJOURS les composants CardHeader, CardTitle, CardDescription, CardContent et CardFooter de @shadcn/ui/card.`,
      timestamp: new Date().toISOString()
    };
    const savedMessages = saved ? JSON.parse(saved) : [];
    // Ajouter le message système uniquement s'il n'existe pas déjà
    if (!savedMessages.some((msg: { role: string; }) => msg.role === "system")) {
      savedMessages.unshift(systemMessage);
    }
    return savedMessages;
  });

  const renderPreviewComponent = useCallback((content: ContentData) => (
    <PreviewWrapper
      content={content}
      onContentGenerated={onContentGenerated}
    />
  ), [onContentGenerated]);

  // Optimisation du scroll automatique
  const scrollToBottom = () => {
    if (contentRef.current) {
      const isAtBottom = contentRef.current.scrollHeight - contentRef.current.scrollTop <= contentRef.current.clientHeight + 100;
      if (isAtBottom) {
        contentRef.current.scrollTop = contentRef.current.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Se déclenche à chaque mise à jour des messages

  const clearHistory = () => {
    localStorage.removeItem("chatHistory");
    setMessages([]);
  };

  const processMessageForContent = (message: string) => {
    // Recherche de blocs de code React
    const reactComponentRegex = /```(jsx|tsx)\n([\s\S]*?)```/g;
    let match;

    while ((match = reactComponentRegex.exec(message)) !== null) {
      onContentGenerated({
        type: "react",
        content: match[2],
        language: match[1],
      });
    }

    // Recherche de blocs de code Mermaid
    const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
    while ((match = mermaidRegex.exec(message)) !== null) {
      onContentGenerated({
        type: "mermaid",
        content: match[1],
      });
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: inputText,
      timestamp: new Date().toISOString(),
    };

    setInputText(""); // Reset input immediately for better UX
    setIsLoading(true);

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    localStorage.setItem("chatHistory", JSON.stringify(updatedMessages));

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: updatedMessages.map(({ role, content }) => ({
          role,
          content,
        })),
        model: "llama-3.3-70b-versatile",
        // model: "llama-3.2-11b-vision-preview",
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 1,
        stream: true,
        stop: null,
      });

      let fullResponse = "";
      const assistantMessage: Message = {
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
      };

      // Optimisation de la mise à jour des messages pendant le streaming
      let lastUpdate = Date.now();
      for await (const chunk of chatCompletion) {
        const content = chunk.choices[0]?.delta?.content ?? "";
        fullResponse += content;
        assistantMessage.content = fullResponse;
        
        // Mise à jour plus fréquente pendant le streaming
        const now = Date.now();
        if (now - lastUpdate > 50) { // Mise à jour toutes les 50ms
          setMessages([...updatedMessages, { ...assistantMessage }]);
          lastUpdate = now;
        }
      }

      // Mise à jour finale avec le message complet
      const newMessages = [...updatedMessages, { ...assistantMessage, content: fullResponse }];
      setMessages(newMessages);
      localStorage.setItem("chatHistory", JSON.stringify(newMessages));
      processMessageForContent(fullResponse);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      const errorMessage: Message = {
        role: "system",
        content: "Error occured while fetching response",
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      localStorage.setItem("chatHistory", JSON.stringify(finalMessages));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-white rounded-t-lg shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800">Chat with Mia</h2>
        <Button
          onClick={clearHistory}
          variant="secondary"
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors duration-200"
        >
          Clear History
        </Button>
      </div>

      {/* Chat History - Container */}
      <div className="flex-1 relative">
        {/* Scrollable Messages Area */}
        <div ref={contentRef} className="absolute inset-0 overflow-y-auto">
          <div className="p-4 space-y-4">
            {messages
              .filter((message: Message) => message.role !== "system")
              .map((message: Message, index: number) => {
                const messageClassName = message.role === "user" 
                  ? "bg-blue-500 text-white" 
                  : "bg-white text-slate-800";

                return (
                  <div
                    key={`${message.timestamp}-${index}`}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${messageClassName}`}
                    >
                      {message.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none">
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
              })}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 bg-white rounded-b-lg">
        <div className="flex gap-2">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[50px] max-h-[150px]"
            placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputText.trim()}
            variant={isLoading || !inputText.trim() ? "secondary" : "default"}
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
};
