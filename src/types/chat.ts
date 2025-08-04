import { ContentData } from './content';

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

export interface ChatProps {
  onContentGenerated: (data: ContentData) => void;
}

export interface PreviewWrapperProps {
  content: ContentData;
  onContentGenerated: (data: ContentData) => void;
}