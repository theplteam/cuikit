import { Dialogue } from '../../packages/chat-ui/src/models/dialogue/Dialogue.ts';
import { Message } from '../../packages/chat-ui/src/models/Message.ts';
import { DDialogue } from '../../packages/chat-ui/src/models/DialogueData.ts';
import OpenAI from 'openai';

export type ChatGptDialogueData = {
  variable?: number;
} & DDialogue;

export class ChatGptDialogue extends Dialogue<ChatGptDialogueData> {
  private _abortController?: AbortController;

  constructor(data: ChatGptDialogueData, private _instance: OpenAI) {
    super(data);
  }

  stopStreaming = () => {
    this._abortController?.abort();
  }

  streamMessage = async (text: string, _userMessage: Message, assistantMessage: Message) => {
    const messages = this.messagesFormatted;
    const stream = await this._instance.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        ...messages,
        {
          role: 'user',
          content: text,
        },
      ],
      stream: true,
    });


    this._abortController = stream.controller;

    for await (const chunk of stream) {
      assistantMessage.text += chunk.choices[0].delta.content ?? '';
    }
  }
}
