import React from 'react';
import { ContentData } from '../types';

interface CodePreviewProps {
  content: ContentData;
  onOpenCanvas: () => void;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ content, onOpenCanvas }) => {
  return (
    <button
      onClick={onOpenCanvas}
      className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-left transition-colors"
    >
      <div className="text-gray-500 font-mono text-sm">&lt;/&gt;</div>
      <div className="flex-1">
        <div className="font-medium text-gray-900">
          {content.type === "mermaid" ? "Show Diagram" : "Show Component"}
        </div>
        <div className="text-sm text-gray-600">
          Click to {content.type === "mermaid" ? "open diagram" : "open component"}
        </div>
      </div>
      <div className="text-gray-400">›</div>
    </button>
  );
};

export default CodePreview;
