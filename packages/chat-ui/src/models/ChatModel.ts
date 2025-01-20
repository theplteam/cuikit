import { ChatDialogue } from './ChatDialogue';
import { ChatActions } from './ChatActions';

const NOOP = (name?: string) => () => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`You are using an empty function ${name ? '"'+name+'" ' : ''}that does nothing.`);
  }
}

export type ChatModelProps = {
  openNew?: () => void;
  deleteDialogue?: (dialogue: ChatDialogue) => void;
  openDialogue?: (dialogue: ChatDialogue) => void;
};

export class ChatModel {
  openNew: () => void;
  deleteDialogue: (dialogue: ChatDialogue) => void;
  openDialogue: (dialogue: ChatDialogue) => void;

  readonly actions = new ChatActions();

  constructor(props?: ChatModelProps) {
    this.openNew = props?.openNew ?? NOOP('openNew');
    this.deleteDialogue = props?.deleteDialogue ?? NOOP('deleteDialogue');
    this.openDialogue = props?.openDialogue ?? NOOP('openDialogue');
  }

  init = () => {
    return this;
  }
}
