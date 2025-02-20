import * as React from 'react';
import { DDialogue, DMessage, Message } from '../../models';
import { NOOP } from '../../utils/NOOP';
import { IdType } from '../../types';
import { DialogueMessages } from '../../models/DialogueMessages';
import { ObservableReactValue } from '../../utils/observers';
import { DialogueListenersMap } from '../dialogue/DialogueListenersMap';

export type ApiRefType<DM extends DMessage = any, DD extends DDialogue<DM> = any> = {
  /**
   * Get all messages from current dialogue
   */
  getAllMessages: () => DM[];
  /**
   * Get all dialogues
   */
  getAllDialogues: () => DD[];
  /**
   * Get current dialogue
   */
  getCurrentDialogue: () => DD | undefined;
  /**
   * Get messages from current branch
   * @see https://docs.playliner.com/introduction/branching/
   */
  getBranchMessages: () => DM[];
  /**
   * Delete dialogue by id
   */
  deleteDialogue: (dialogueId: IdType) => void;
  /**
   * Send message to conversation
   */
  sendUserMessage: (content: DMessage['content']) => Promise<void>;
  /**
   * Triggered when another dialogue is opened.
   */
  onChangeDialogue: (dialogueId: IdType) => void;
  /**
   * Triggered when a new dialogue is opened.
   * @param dialogue
   */
  openNewDialogue: (dialogue: DD) => void;
  /**
   * Set your own waiting status for a chat response.
   */
  setProgressStatus: (status: string) => void;
  /**
   * Change dialogue branch
   */
  handleChangeBranch: DialogueMessages<DM>['handleChangeBranch'];
};

export type PrivateApiRefType<DM extends DMessage = any, DD extends DDialogue<DM> = any> = {
  allMessages: ObservableReactValue<Readonly<Message<DM>[]>>;
  branch: ObservableReactValue<Readonly<Message<DM>[]>>;
  getListener: <K extends keyof DialogueListenersMap<DM>>(key: K) => DialogueListenersMap<DM>[K] | undefined;
} & ApiRefType<DM, DD>;

export const useApiRef = <DM extends DMessage, DD extends DDialogue<DM>>(userApiRef: React.MutableRefObject<ApiRefType | null> | undefined) => {
  const apiRef = React.useRef<PrivateApiRefType<DM, DD>>({
    onChangeDialogue: NOOP,
    openNewDialogue: NOOP,
    deleteDialogue: NOOP,
    sendUserMessage: () => new Promise((resolve) => setTimeout(resolve, 100)),
    setProgressStatus: NOOP,
    handleChangeBranch: NOOP,
    getCurrentDialogue: () => undefined,
    getAllMessages: () => [],
    getBranchMessages: () => [],
    getAllDialogues: () => [],
    allMessages: new ObservableReactValue([]),
    branch: new ObservableReactValue([]),
    getListener: () => undefined,
  });

  React.useMemo(() => {
    if (userApiRef) {
      const {getListener, branch, allMessages, ...otherProps} = apiRef.current;
      userApiRef.current = otherProps;
    }
  }, [userApiRef]);

  return apiRef;
}
