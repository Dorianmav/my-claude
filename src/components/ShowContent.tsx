import React from 'react'
import { Chat } from './Chat';

interface ShowContentProps {
  content?: string;
}

export const ShowContent: React.FC<ShowContentProps> = ({ content }) => {
  return (
    <div className="flex flex-row gap-4 w-full min-h-screen p-4">
      <div className="flex-1">
        <Chat />
      </div>
      <div className="flex-1 p-4 bg-gray-50 rounded-lg">
        <p>{content}</p>
      </div>
    </div>
  ) 
}
