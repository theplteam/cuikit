import { DialogueAbstract } from './DialogueAbstract';
import { ChatActions } from './ChatActions';
import { PartialExcept } from './types';

const NOOP = (name?: string) => () => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`You are using an empty function ${name ? '"'+name+'" ' : ''}that does nothing.`);
  }
}

type Props<D extends DialogueAbstract> = {
  /**
   * Open empty dialogue
   */
  openNew: () => void;
  /**
   * Delete selected dialogue
   * @param dialogue
   */
  delete: (dialogue: D) => void;
  /**
   * Open selected dialogue
   * @param dialogue
   */
  open: (dialogue: D) => void;
  /**
   * Update dialogue timestamp
   * @param dialogue
   */
  touch: (dialogue: D) => void;
  /**
   * Update dialogue data
   * @param dialogue
   */
  edit?: (newData: PartialExcept<D['data']['data'], 'id'>, dialogue: D) => any,
};

export type ChatModelProps<D extends DialogueAbstract> = Partial<Props<D>>;

export class ChatModel<D extends DialogueAbstract = DialogueAbstract> {
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
