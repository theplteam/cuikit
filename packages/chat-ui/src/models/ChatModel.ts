import { ThreadModel } from './ThreadModel';
import { ChatActions } from './ChatActions';
import { Message } from './MessageModel';
import { Thread } from './ThreadData';
import { PartialExcept } from './types';

const NOOP = (name?: string) => () => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`You are using an empty function ${name ? '"'+name+'" ' : ''}that does nothing.`);
  }
}

type Props<DM extends Message, DD extends Thread<DM>, D = ThreadModel<DM, DD>> = {
  /**
   * Open empty thread
   */
  openNew: () => void;
  /**
   * Delete selected thread
   * @param thread
   */
  delete: (thread: D) => void;
  /**
   * Open selected thread
   * @param thread
   */
  open: (thread: D) => void;
  /**
   * Update thread timestamp
   * @param thread
   */
  touch: (thread: D) => void;
  /**
   * Update thread data
   * @param thread
   */
  edit?: (newData: PartialExcept<DD, 'id'>, thread: ThreadModel<DM, DD>) => any,
};

export type ChatModelProps<DM extends Message, DD extends Thread<DM>> = Partial<Props<DM, DD>>;

/**
 * TODO: #MB NO NEEDED
 */
export class ChatModel<DM extends Message, DD extends Thread<DM>> {
  readonly threadActions: Props<DM, DD>;

  readonly actions = new ChatActions<DM, DD>();

  constructor(props: ChatModelProps<DM, DD> | undefined) {
    this.threadActions = {
      openNew: props?.openNew ?? NOOP('openNew'),
      delete: props?.delete ?? NOOP('delete'),
      open: props?.open ?? NOOP('open'),
      touch: props?.touch ?? NOOP('touch'),
      edit: props?.edit ?? NOOP('edit'),
    };

  }

  init = () => {
    return this;
  }
}
