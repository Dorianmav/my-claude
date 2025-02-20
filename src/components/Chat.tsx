import React, { useEffect, useRef, useState, KeyboardEvent } from "react";
import Groq from "groq-sdk";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ContentData } from '../types';

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

interface ChatProps {
  onContentGenerated: (data: ContentData) => void;
}

const groq = new Groq({
  apiKey: import.meta.env.VITE_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const Chat: React.FC<ChatProps> = ({ onContentGenerated }) => {
  const [inputText, setinputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [];
  });

  // Optimisation du scroll automatique
  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]); // Ne se déclenche que lorsqu'un nouveau message est ajouté

  const clearHistory = () => {
    localStorage.removeItem("chatHistory");
    setMessages([]);
  };

  const processMessageForContent = (message: string) => {
    // Recherche de blocs de code React
    const reactComponentRegex = /```(jsx|tsx)\n([\s\S]*?)```/g;
    let match = reactComponentRegex.exec(message);
    if (match) {
      const [, language, code] = match;
      onContentGenerated({
        type: 'react-component',
        content: code.trim(),
        language,
        metadata: {
          artifact: {
            identifier: `artifact-${Date.now()}`,
            type: 'application/vnd.ant.react',
            language,
            title: 'React Component',
            content: code.trim(),
            isClosed: true
          }
        }
      });
      return;
    }

    // Recherche de diagrammes Mermaid
    const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
    match = mermaidRegex.exec(message);
    if (match) {
      const [, diagram] = match;
      onContentGenerated({
        type: 'mermaid',
        content: diagram.trim(),
        metadata: {
          artifact: {
            identifier: `artifact-${Date.now()}`,
            type: 'application/vnd.ant.mermaid',
            title: 'Diagram',
            content: diagram.trim(),
            isClosed: true
          }
        }
      });
      return;
    }

    // Recherche d'autres blocs de code
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    match = codeBlockRegex.exec(message);
    if (match) {
      const [, language, code] = match;
      onContentGenerated({
        type: 'code',
        content: code.trim(),
        language: language || 'typescript',
        metadata: {
          artifact: {
            identifier: `artifact-${Date.now()}`,
            type: 'application/vnd.ant.code',
            language: language || 'typescript',
            title: 'Code',
            content: code.trim(),
            isClosed: true
          }
        }
      });
      return;
    }

    // Recherche de contenu SVG
    const svgRegex = /<svg[\s\S]*?<\/svg>/g;
    match = svgRegex.exec(message);
    if (match) {
      const [svg] = match;
      onContentGenerated({
        type: 'svg',
        content: svg,
        metadata: {
          artifact: {
            identifier: `artifact-${Date.now()}`,
            type: 'image/svg+xml',
            title: 'SVG Image',
            content: svg,
            isClosed: true
          }
        }
      });
      return;
    }

    // Par défaut, traiter comme du markdown
    onContentGenerated({
      type: 'markdown',
      content: message,
      metadata: {
        artifact: {
          identifier: `artifact-${Date.now()}`,
          type: 'text/markdown',
          title: 'Response',
          content: message,
          isClosed: true
        }
      }
    });
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: inputText,
      timestamp: new Date().toISOString(),
    };

    setinputText(""); // Reset input immediately for better UX
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
      for await (const chunk of chatCompletion) {
        const content = chunk.choices[0]?.delta?.content ?? "";
        fullResponse += content;
        assistantMessage.content = fullResponse;
        
        // Mise à jour moins fréquente pendant le streaming
        if (content.includes("\n") || content.length > 50) {
          setMessages([...updatedMessages, { ...assistantMessage }]);
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
        <button
          onClick={clearHistory}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors duration-200"
        >
          Clear History
        </button>
      </div>

      {/* Chat History - Container */}
      <div className="flex-1 relative">
        {/* Scrollable Messages Area */}
        <div ref={contentRef} className="absolute inset-0 overflow-y-auto">
          <div className="p-4 space-y-4">
            {messages.map((message: Message, index: number) => (
              <div
                key={`${message.timestamp ?? Date.now()}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-slate-800 shadow-sm"
                  }`}
                >
                  <div className="font-medium mb-1">
                    {message.role === "user" ? "You" : "Mia"}
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <MarkdownRenderer content={message.content} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 bg-white rounded-b-lg">
        <div className="flex gap-2">
          <textarea
            value={inputText}
            onChange={(e) => setinputText(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[50px] max-h-[150px]"
            placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputText.trim()}
            className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
              isLoading || !inputText.trim()
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};
