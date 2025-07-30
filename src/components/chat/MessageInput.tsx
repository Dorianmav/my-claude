import React, { KeyboardEvent } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import * as LucideReact from 'lucide-react';

interface MessageInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  inputText,
  setInputText,
  onSendMessage,
  isLoading,
}) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="p-6 border-t border-slate-200 bg-white backdrop-blur-sm bg-opacity-90 rounded-b-xl">
      <div className="flex gap-3">
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[60px] max-h-[150px] shadow-sm transition-all duration-200 hover:border-slate-300"
          placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
          disabled={isLoading}
        />
        <Button
          onClick={onSendMessage}
          disabled={isLoading || !inputText.trim()}
          className={`w-24 h-[60px] flex items-center justify-center gap-2 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 ${
            isLoading || !inputText.trim()
              ? "bg-slate-200 text-slate-500"
              : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending...</span>
            </div>
          ) : (
            <>
              <LucideReact.SendHorizontal className="w-5 h-5" />
              <span>Send</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};