import React from 'react';
import { ContentData } from '../types';
import { Button } from "./ui/button";

interface CodePreviewProps {
  content: ContentData;
  onOpenCanvas: () => void;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ content, onOpenCanvas }) => {
  return (
    <Button
      onClick={onOpenCanvas}
      variant="outline"
      className="w-full flex items-center gap-3 justify-start h-auto py-3"
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
    </Button>
  );
};

export default CodePreview;
