import { ChatDialogue } from './ChatDialogue';
import { ChatActions } from './ChatActions';

const NOOP = (name?: string) => () => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`You are using an empty function ${name ? '"'+name+'" ' : ''}that does nothing.`);
  }
}

export type ChatModelProps<T extends ChatDialogue> = Partial<{
  openNew: () => void;
  deleteDialogue: (dialogue: T) => void;
  openDialogue: (dialogue: T) => void;
}>;

export class ChatModel<T extends ChatDialogue = ChatDialogue> {
  openNew: () => void;
  deleteDialogue: (dialogue: T) => void;
  openDialogue: (dialogue: T) => void;

  readonly actions = new ChatActions();

  constructor(props?: ChatModelProps<T>) {
    this.openNew = props?.openNew ?? NOOP('openNew');
    this.deleteDialogue = props?.deleteDialogue ?? NOOP('deleteDialogue');
    this.openDialogue = props?.openDialogue ?? NOOP('openDialogue');
  }

  init = () => {
    return this;
  }
}
