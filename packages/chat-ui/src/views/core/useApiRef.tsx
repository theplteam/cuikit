import * as React from 'react';
import { DialogueApi, getDialogueMockApi } from '../DialogueApi';
import { DDialogue, DMessage } from '../../models';
import { NOOP } from '../../utils/NOOP';
import { IdType } from '../../types';
import { DialogueMessages } from '../../models/DialogueMessages';

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
   * TODO: НЕ ДОБАВЛЕН В ИНИЦИАЛИЗАЦИЮ
   */
  sendUserMessage: (content: DMessage['content']) => void;
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
  dialogue: DialogueApi<DM>;
} & ApiRefType<DM, DD>;

export const useApiRef = <DM extends DMessage, DD extends DDialogue<DM>>() => {
  return React.useRef<PrivateApiRefType<DM, DD>>({
    dialogue: getDialogueMockApi(),
    onChangeDialogue: NOOP,
    openNewDialogue: NOOP,
    deleteDialogue: NOOP,
    sendUserMessage: NOOP,
    setProgressStatus: NOOP,
    handleChangeBranch: NOOP,
    getCurrentDialogue: () => undefined,
    getAllMessages: () => [],
    getBranchMessages: () => [],
    getAllDialogues: () => [],
  });
}
