import React from 'react';
import { PreviewWrapperProps } from '../../types/chat';
import CodePreview from '../canvas/CodePreview';

export const PreviewWrapper: React.FC<PreviewWrapperProps> = ({ 
  content, 
  onContentGenerated 
}) => (
  <CodePreview 
    content={content} 
    onOpenCanvas={() => onContentGenerated(content)} 
  />
);