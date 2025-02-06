import React, { useEffect, useRef, useState, KeyboardEvent } from 'react'
import Groq from 'groq-sdk';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

const groq = new Groq({
  apiKey: import.meta.env.VITE_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export const Chat = () => {
  const [inputText, setinputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (contentRef.current) {
      //TODO Voir le scroll
      // contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [messages]);

  const clearHistory = () => {
    localStorage.removeItem('chatHistory');
    setMessages([]);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputText,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    localStorage.setItem('chatHistory', JSON.stringify(updatedMessages));
    setinputText('');

    // Send the message to groq
    setIsLoading(true);

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: updatedMessages.map(({ role, content }) => ({ role, content })),
        model: "llama-3.3-70b-versatile",
        // model: "llama-3.2-11b-vision-preview",
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 1,
        stream: true,
        stop: null
      });

      let fullResponse = '';
      let assistantMessage: Message = {
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString()
      };

      for await (const chunk of chatCompletion) {
        const content = chunk.choices[0]?.delta?.content ?? '';
        fullResponse += content;
        assistantMessage.content = fullResponse;
        setMessages([...updatedMessages, { ...assistantMessage }]);
      }

      assistantMessage = {
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date().toISOString()
      };

      const newMessages = [...updatedMessages, assistantMessage];
      setMessages(newMessages);

      localStorage.setItem('chatHistory', JSON.stringify(newMessages));

    } catch (error) {
      console.error('Error: ', error);

      const errorMessage: Message = {
        role: 'system',
        content: 'Error occured while fetching response',
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      localStorage.setItem('chatHistory', JSON.stringify(finalMessages));

    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="text-center">
      <div className="p-5 max-w-[1000px] mx-auto bg-white shadow-md rounded-lg flex flex-col h-[80vh]">
        {/* Header */}
        <div >
          <button
            onClick={clearHistory}
            className="px-4 py-2 bg-gray-600 text-white rounded-md cursor-pointer"
          >
            Clear History
          </button>
        </div>

        {/* Chat History */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto p-5 border border-gray-200 rounded-md bg-gray-100 mb-5"
        >
          {messages.map((message: Message, index: number) => (
            <div
              key={`${message.timestamp || Date.now()}-${index}`}
              className={`mb-5 p-3 rounded-lg border border-gray-300 max-w-[80%] ${
                message.role === "user" ? "bg-blue-100 ml-auto" : message.role === "assistant" ? "bg-white ml-0" : "bg-red-100 ml-0"
              }`}
            >
              <div
                className={`font-bold mb-1 ${
                  message.role === "user" ? "text-blue-700" : message.role === "assistant" ? "text-green-700" : "text-red-700"
                }`}
              >
                {message.role === "user" ? "You" : message.role === "assistant" ? "Mia" : "System"}
              </div>
              <p> {message.content} </p>
            </div>
          ))}
        </div>

        {/* Input & Send */}
        <div className="flex gap-2">
          <textarea
            value={inputText}
            onChange={(e) => setinputText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-2 rounded-md border border-gray-400 resize-y min-h-[50px] max-h-[150px]"
            placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputText.trim()}
            className={`px-4 py-2 rounded-md text-white transition-all self-end ${isLoading || !inputText.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
              }`}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  )
}
