import * as React from "react";
import { GoogleGenAI } from "@google/genai";
import {
  ChatGptAdapter,
  ChatPage,
  MessageSentParams,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";

class GeminiModel {
  private _abortController?: AbortController;

  private _ai: GoogleGenAI;

  constructor() {
    this._ai = new GoogleGenAI({
      apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    });
  }

  stopStreaming = () => {
    this._abortController?.abort();
  };

  streamMessage = async ({ reasoning, history, content, pushChunk, onFinish }: MessageSentParams) => {
    const userText = typeof content === "string"
      ? content
      : (content as any[]).find((p: any) => p.type === "text")?.text ?? "";

    const geminiHistory = (history as any[]).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: typeof msg.content === "string" ? msg.content : "" }],
    }));

    this._abortController = new AbortController();

    const stream = await this._ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: [
        ...geminiHistory,
        { role: "user", parts: [{ text: userText }] },
      ],
      config: {
        thinkingConfig: {
          includeThoughts: true,
          thinkingBudget: 8000,
        },
      },
    });

    for await (const chunk of stream) {
      for (const part of chunk.candidates?.[0]?.content?.parts ?? []) {
        if (part.thought) {
          reasoning.pushChunk(part.text ?? "");
        } else {
          pushChunk(part.text ?? "");
        }
      }
    }

    onFinish();
  };
}

const App: React.FC = () => {
  const model = React.useMemo(() => new GeminiModel(), []);

  return (
    <Box height="100dvh" width="100dvw">
      <ChatGptAdapter>
        <ChatPage
          enableReasoning
          threads={[]}
          handleStopMessageStreaming={model.stopStreaming}
          onUserMessageSent={model.streamMessage}
        />
      </ChatGptAdapter>
    </Box>
  );
};

export default App;
