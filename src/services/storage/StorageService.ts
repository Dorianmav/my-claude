import { Message } from "../../types/chat";

const CHAT_HISTORY_KEY = "chatHistory";

export class StorageService {
  static getChatHistory(): Message[] {
    try {
      const saved = localStorage.getItem(CHAT_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique:", error);
      return [];
    }
  }

  static saveChatHistory(messages: Message[]): void {
    try {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'historique:", error);
    }
  }

  static clearChatHistory(): void {
    try {
      localStorage.removeItem(CHAT_HISTORY_KEY);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'historique:", error);
    }
  }
}

export const storageService = StorageService;