import React from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import CodeRenderer from './CodeRenderer';

// Types de contenu supportés
export type ContentType = 'code' | 'markdown' | 'react-component' | 'visualization';

interface ContentData {
  type: ContentType;
  content: string | React.ReactNode;
  language?: string;
  metadata?: Record<string, unknown>;
}

interface ShowContentProps {
  isShow: boolean;
  contentData?: ContentData;
  onClose: () => void;
}

const ShowContent: React.FC<ShowContentProps> = ({ isShow, contentData, onClose }) => {
  const renderContent = () => {
    if (!contentData) return null;

    switch (contentData.type) {
      case 'code':
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <CodeRenderer className={`language-${contentData.language || 'typescript'}`}>
              {contentData.content as string}
            </CodeRenderer>
          </div>
        );
      
      case 'markdown':
        return (
          <div className="p-4">
            <MarkdownRenderer content={contentData.content as string} />
          </div>
        );
      
      case 'react-component':
        return (
          <div className="p-4">
            {contentData.content as React.ReactNode}
          </div>
        );
      
      case 'visualization':
        return (
          <div className="p-4 flex justify-center items-center">
            {typeof contentData.content === 'string' ? (
              <img 
                src={contentData.content} 
                alt="Visualization" 
                className="max-w-full h-auto"
              />
            ) : (
              contentData.content
            )}
          </div>
        );
      
      default:
        return <div>Unsupported content type</div>;
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-1/2 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isShow ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {contentData?.type ? `${contentData.type.charAt(0).toUpperCase() + contentData.type.slice(1)} View` : 'Content View'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ShowContent;
