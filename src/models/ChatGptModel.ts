import { DDialogue } from '../../packages/chat-ui/src/models/DialogueData.ts';
import OpenAI from 'openai';
import { DMessage, MessageStreamingParams, RatingType } from 'chat-ui';

export type ChatGptDialogueData = {
  variable?: number;
} & DDialogue;

export class ChatGptModel {
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

  streamMessage = async (params: MessageStreamingParams) => {
    const messages = params.history;
    const stream = await this._instance.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        ...messages,
        {
          role: 'user',
          content: params.text,
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

  sendMessageFeedback = (params: { message: DMessage, feedback: string, tags: string[]}) => {
    const { message, feedback, tags } = params;
    console.log(message, feedback, tags);
  }

  sendMessageRating = (params: { rating: RatingType | undefined }) => {
    const { rating } = params;
    console.log(rating);
  }
}
