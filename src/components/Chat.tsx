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

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [messages]);

  const clearHistory = () => {
    localStorage.removeItem("chatHistory");
    setMessages([]);
  };

  const processMessageForContent = (message: string) => {
    // Recherche de blocs de code avec indication de langage
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    let foundCode = false;

    while ((match = codeBlockRegex.exec(message)) !== null) {
      foundCode = true;
      // match[0] est le bloc complet, match[1] est le langage, match[2] est le code
      const language = match[1] || 'typescript';
      const code = match[2].trim();

      const contentData: ContentData = {
        type: 'code',
        content: code,
        language: language,
        metadata: {
          artifact: {
            identifier: `artifact-${Date.now()}`,
            type: 'application/vnd.ant.code',
            language: language,
            title: 'Generated Code',
            content: code,
            isClosed: true
          }
        }
      };
      onContentGenerated(contentData);
    }

    // Si aucun code n'a été trouvé, traiter comme du markdown
    if (!foundCode) {
      const contentData: ContentData = {
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
      };
      onContentGenerated(contentData);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: inputText,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    localStorage.setItem("chatHistory", JSON.stringify(updatedMessages));
    setinputText("");

    // Send the message to groq
    setIsLoading(true);

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
      let assistantMessage: Message = {
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
      };

      for await (const chunk of chatCompletion) {
        const content = chunk.choices[0]?.delta?.content ?? "";
        fullResponse += content;
        assistantMessage.content = fullResponse;
        setMessages([...updatedMessages, { ...assistantMessage }]);
      }

      assistantMessage = {
        role: "assistant",
        content: fullResponse,
        timestamp: new Date().toISOString(),
      };

      const newMessages = [...updatedMessages, assistantMessage];
      setMessages(newMessages);

      localStorage.setItem("chatHistory", JSON.stringify(newMessages));

      processMessageForContent(fullResponse);
    } catch (error) {
      console.error("Error: ", error);

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
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-6">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white rounded-t-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">Chat with Mia</h2>
            <button
              onClick={clearHistory}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
            >
              Clear History
            </button>
          </div>

          {/* Chat History */}
          <div ref={contentRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message: Message, index: number) => (
              <div
                key={`${message.timestamp ?? Date.now()}-${index}`}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800"
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

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <textarea
                value={inputText}
                onChange={(e) => setinputText(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[50px] max-h-[150px]"
                placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputText.trim()}
                className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  isLoading || !inputText.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
