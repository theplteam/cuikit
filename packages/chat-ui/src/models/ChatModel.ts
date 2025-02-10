import { Dialogue } from './Dialogue';
import { ChatActions } from './ChatActions';
import { DMessage } from './Message';
import { DDialogue } from './DialogueData';
import { PartialExcept } from './types';

const NOOP = (name?: string) => () => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`You are using an empty function ${name ? '"'+name+'" ' : ''}that does nothing.`);
  }
}

type Props<DM extends DMessage, DD extends DDialogue<DM>, D = Dialogue<DM, DD>> = {
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
  edit?: (newData: PartialExcept<DD, 'id'>, dialogue: Dialogue<DM, DD>) => any,
};

export type ChatModelProps<DM extends DMessage, DD extends DDialogue<DM>> = Partial<Props<DM, DD>>;

export class ChatModel<DM extends DMessage, DD extends DDialogue<DM>> {
  readonly dialogueActions: Props<DM, DD>;

  readonly actions = new ChatActions<DM, DD>();

  constructor(props: ChatModelProps<DM, DD> | undefined) {
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
