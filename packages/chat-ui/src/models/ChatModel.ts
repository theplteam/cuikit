import { ChatDialogue } from './ChatDialogue';
import { ChatActions } from './ChatActions';

const NOOP = (name?: string) => () => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`You are using an empty function ${name ? '"'+name+'" ' : ''}that does nothing.`);
  }
}

export type ChatModelProps<D extends ChatDialogue = ChatDialogue> = Partial<{
  openNew: () => void;
  deleteDialogue: (dialogue: D) => void;
}>;

export class ChatModel<D extends ChatDialogue = ChatDialogue> {
  openNew: () => void;
  deleteDialogue: (dialogue: D) => void;

  readonly actions = new ChatActions();

  constructor(props?: ChatModelProps<D>) {
    this.openNew = props?.openNew ?? NOOP('openNew');
    this.deleteDialogue = props?.deleteDialogue ?? NOOP('deleteDialogue');
  }

  init = () => {
    return this;
  }
}
