import { Dialogue } from 'models/Dialogue';
import { ChatActions } from './ChatActions';
import { DDialogue } from './DialogueData';

const NOOP = (name?: string) => () => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`You are using an empty function ${name ? '"'+name+'" ' : ''}that does nothing.`);
  }
}

export type ChatModelProps<Data extends DDialogue = DDialogue> = Partial<{
  openNew: () => void;
  deleteDialogue: (dialogue: Dialogue<Data>) => void;
}>;

export class ChatModel<Data extends DDialogue = DDialogue> {
  openNew: () => void;
  deleteDialogue: (dialogue: Dialogue<Data>) => void;

  readonly actions = new ChatActions();

  constructor(props?: ChatModelProps<Data>) {
    this.openNew = props?.openNew ?? NOOP('openNew');
    this.deleteDialogue = props?.deleteDialogue ?? NOOP('deleteDialogue');
  }

  init = () => {
    return this;
  }
}
