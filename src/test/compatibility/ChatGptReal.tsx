import * as React from "react";
import threads from "./chatgpt-thread-test.json";
import {
  ChatGptAdapter,
  ChatPage,
  MessageSentParams,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import OpenAI from 'openai';

class ChatGptModel {
  private _abortController?: AbortController;

  private _instance: OpenAI

  constructor() {
    this._instance = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }

  stopStreaming = () => {
    this._abortController?.abort();
  }

  streamMessage = async (params: MessageSentParams) => {
    const messages: OpenAI.ChatCompletionCreateParamsStreaming['messages'] = params.history;
    const stream = await this._instance.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        ...messages,
        {
          role: 'user',
          content: params.content,
        },
      ],
      stream: true,
    });


    this._abortController = stream.controller;

    for await (const chunk of stream) {
      params.pushChunk(chunk.choices[0].delta.content ?? '');
    }

    params.onFinish();
  }
}


const App: React.FC = () => {
  const dd = threads as any;

  const model = React.useMemo(() => new ChatGptModel(), []);

  return (
    <Box height={"100dvh"} width={"100dvw"}>
      <ChatGptAdapter>
        <ChatPage
          thread={dd[0]}
          threads={dd}
          handleStopMessageStreaming={model.stopStreaming}
          onUserMessageSent={model.streamMessage}
          listPlacement={'right'}
        />
      </ChatGptAdapter>
    </Box>
  );
}

export default App;
