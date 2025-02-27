import { ReactNode } from "react";
// Import from your existing types.ts
import { ContentData } from "../types";

export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export interface CodeRunnerProps {
  code: string | ReactNode;
  language?: string;
  activeTab: TabType;
}

export interface PreviewComponentProps {
  code: string;
  scope: Record<string, unknown>;
}

export interface MermaidRendererProps {
  code: string | ReactNode;
  activeTab: TabType;
}

export interface CanvaProps {
  isShow: boolean;
  onClose: () => void;
  contentData: ContentData;
}

export type TabType = "source" | "preview";
