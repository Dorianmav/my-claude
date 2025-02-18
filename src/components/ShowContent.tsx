import React from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import CodeRenderer from './CodeRenderer';
import { ContentData } from '../types';

interface ShowContentProps {
  isShow: boolean;
  contentData?: ContentData;
  onClose: () => void;
}

const ShowContent: React.FC<ShowContentProps> = ({ isShow, contentData, onClose }) => {
  if (!isShow || !contentData) return null;

  const renderArtifact = () => {
    const artifact = contentData.metadata?.artifact;
    if (!artifact) return renderContent();

    return (
      <div className="h-full flex flex-col">
        {/* Artifact header */}
        <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">{artifact.title}</h3>
          {artifact.isClosed && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        {/* Artifact content */}
        <div className="flex-1 overflow-auto p-4">
          {renderContent()}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    const content = contentData.content;
    if (!content) return null;

    switch (contentData.type) {
      case 'code':
        return (
          <div className="rounded-lg bg-gray-50 p-4">
            <CodeRenderer className={`language-${contentData.language ?? 'typescript'}`}>
              {content}
            </CodeRenderer>
          </div>
        );
      
      case 'markdown':
        return (
          <div className="prose max-w-none">
            <MarkdownRenderer content={content as string} />
          </div>
        );
      
      case 'react-component':
        // Pour les composants React, on suppose que le contenu est déjà un élément React
        return (
          <div className="p-4">
            {content}
          </div>
        );
      
      case 'mermaid':
        return (
          <div className="flex justify-center p-4">
            <div className="mermaid w-full">
              {content as string}
            </div>
          </div>
        );
      
      case 'svg':
        if (typeof content !== 'string') return null;
        return (
          <div className="flex justify-center p-4">
            <div 
              className="max-w-full"
              dangerouslySetInnerHTML={{ __html: content }} 
            />
          </div>
        );
      
      case 'html':
        if (typeof content !== 'string') return null;
        return (
          <div 
            className="p-4"
            dangerouslySetInnerHTML={{ __html: content }} 
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-white">
      {renderArtifact()}
    </div>
  );
};

export default ShowContent;
