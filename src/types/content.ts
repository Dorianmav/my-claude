import React from 'react';

export type ArtifactType = 
  | 'application/vnd.ant.code'
  | 'application/vnd.ant.react'
  | 'application/vnd.ant.mermaid'
  | 'image/svg+xml'
  | 'text/html'
  | 'text/markdown';

export interface Artifact {
  identifier: string;
  type: ArtifactType;
  language?: string;
  title: string;
  content: string;
  isClosed?: boolean;
}

export type ContentType = 'code' | 'markdown' | 'react-component' | 'mermaid' | 'svg' | 'html'| 'visualization'| 'react';

export interface ContentData {
  type: ContentType;
  content: string | React.ReactNode;
  language?: string;
  metadata?: {
    artifact?: Artifact;
  };
  artifact?: Artifact;
}