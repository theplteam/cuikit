import { Dialogue, DDialogue } from 'chat-ui';

export type DCustomDialogue = {
  filters?: string;
} & DDialogue;

export class CustomDialogue extends Dialogue<DCustomDialogue> {
  variable = 1;

  stopStreaming = () => {
    console.log('stopStreaming');
  }

  streamMessage = async () => {
    console.log('streamMessage');
  }

  get messageUrl() {
    return 'https://google.com';
  }
}
