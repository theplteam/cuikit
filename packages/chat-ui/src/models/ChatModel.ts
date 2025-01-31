import { Dialogue } from './Dialogue';
import { ChatActions } from './ChatActions';
import { PartialExcept } from './types';

const NOOP = (name?: string) => () => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`You are using an empty function ${name ? '"'+name+'" ' : ''}that does nothing.`);
  }
}

type Props<D extends Dialogue> = {
  openNew: () => void;
  delete: (dialogue: D) => void;
  open: (dialogue: D) => void;
  touch: (dialogue: D) => void;
  edit?: (newData: PartialExcept<D['data']['data'], 'id'>, dialogue: D) => any,
};

export type ChatModelProps<D extends Dialogue> = Partial<Props<D>>;

export class ChatModel<D extends Dialogue = Dialogue> {
  readonly dialogueActions: Props<D>;

  readonly actions = new ChatActions();

  constructor(props: ChatModelProps<D> | undefined) {
    this.dialogueActions = {
      openNew: props?.openNew ?? NOOP('openNew'),
      delete: props?.delete ?? NOOP('deleteDialogue'),
      open: props?.open ?? NOOP('openDialogue'),
      touch: props?.touch ?? NOOP('touchDialogue'),
      edit: props?.edit ?? NOOP('editDialogue'),
    };

  }

  init = () => {
    return this;
  }
}
