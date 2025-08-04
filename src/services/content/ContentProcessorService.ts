import { ContentData } from "../../types/content";

export class ContentProcessorService {
  static processMessageForContent(
    message: string,
    onContentGenerated: (data: ContentData) => void
  ): void {
    // Recherche de blocs de code React
    const reactComponentRegex = /```(jsx|tsx)\n([\s\S]*?)```/g;
    let match;

    while ((match = reactComponentRegex.exec(message)) !== null) {
      onContentGenerated({
        type: "react",
        content: match[2],
        language: match[1],
      });
    }

    // Recherche de blocs de code Mermaid
    const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
    while ((match = mermaidRegex.exec(message)) !== null) {
      onContentGenerated({
        type: "mermaid",
        content: match[1],
      });
    }
  }
}

export const contentProcessorService = ContentProcessorService;