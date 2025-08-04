import Groq from "groq-sdk";
import { Message } from "../../types/chat";

export class GroqService {
  private readonly groq: Groq;

  constructor() {
    this.groq = new Groq({
      apiKey: import.meta.env.VITE_APP_GROQ_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }

  async sendMessage(messages: Message[]) {
    return await this.groq.chat.completions.create({
      messages: messages.map(({ role, content }) => ({
        role,
        content,
      })),
      model: "llama-3.3-70b-versatile",
      // model: "llama-3.2-11b-vision-preview",
      // model: "deepseek-r1-distill-llama-70b",
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 1,
      stream: true,
      stop: null,
    });
  }
}

// Instance singleton
export const groqService = new GroqService();