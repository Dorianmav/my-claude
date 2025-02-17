import React from 'react'
import { Chat } from './Chat';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ShowContentProps {
  content?: string;
  isShow: boolean;
}

export const ShowContent: React.FC<ShowContentProps> = ({ content, isShow }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Colonne de gauche - Chat */}
      <div className="flex-1 p-6 border-r border-gray-200">
        <Chat />
      </div>
      
      {/* Colonne de droite - Contenu */}
      <div className={`flex-1 p-6 bg-white ${isShow ? 'block' : 'hidden'}`}>
        <div className="max-w-3xl mx-auto">
          <MarkdownRenderer content={content} />
        </div>
      </div>
    </div>
  ) 
}
