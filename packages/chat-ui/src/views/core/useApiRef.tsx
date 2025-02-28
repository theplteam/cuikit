import * as React from 'react';
import { Thread, DMessage, MessageModel } from '../../models';
import { NOOP } from '../../utils/NOOP';
import { IdType } from '../../types';
import { ThreadMessages } from '../../models/ThreadMessages';
import { ObservableReactValue } from '../../utils/observers';
import { ThreadListenersMap } from '../thread/ThreadListenersMap';

export type ApiRefType<DM extends DMessage = any, DD extends Thread<DM> = any> = {
  /**
   * Get all messages from current thread
   */
  getAllMessages: () => DM[];
  /**
   * Get all threads
   */
  getAllThreads: () => DD[];
  /**
   * Get current thread
   */
  getCurrentThread: () => DD | undefined;
  /**
   * Get messages from current branch
   * @see https://docs.playliner.com/introduction/branching/
   */
  getBranchMessages: () => DM[];
  /**
   * Delete thread by id
   */
  deleteThread: (threadId: IdType) => void;
  /**
   * Send message to conversation
   */
  sendUserMessage: (content: DMessage['content']) => Promise<boolean>;
  /**
   * Triggered when another thread is opened.
   */
  onChangeThread: (threadId: IdType) => void;
  /**
   * Triggered when a new thread is opened.
   * @param thread
   */
  openNewThread: (thread?: DD) => void;
  /**
   * Set your own waiting status for a chat response.
   */
  setProgressStatus: (status: string) => void;
  /**
   * Get waiting status for a chat response.
   */
  getProgressStatus: () => string;
  /**
   * Change thread branch
   */
  handleChangeBranch: ThreadMessages<DM>['handleChangeBranch'];
};

export type PrivateApiRefType<DM extends DMessage = any, DD extends Thread<DM> = any> = {
  allMessages: ObservableReactValue<Readonly<MessageModel<DM>[]>>;
  branch: ObservableReactValue<Readonly<MessageModel<DM>[]>>;
  getListener: <K extends keyof ThreadListenersMap<DM>>(key: K) => ThreadListenersMap<DM>[K] | undefined;
  updateScrollButtonState: () => void;
} & ApiRefType<DM, DD>;

export const useApiRef = <DM extends DMessage, DD extends Thread<DM>>(userApiRef: React.MutableRefObject<ApiRefType | null> | undefined) => {
  const apiRef = React.useRef<PrivateApiRefType<DM, DD>>({
    onChangeThread: NOOP,
    openNewThread: NOOP,
    updateScrollButtonState: NOOP,
    deleteThread: NOOP,
    getProgressStatus: () => '',
    sendUserMessage: () => new Promise((resolve) => setTimeout(resolve, 100)),
    setProgressStatus: NOOP,
    handleChangeBranch: NOOP,
    getCurrentThread: () => undefined,
    getAllMessages: () => [],
    getBranchMessages: () => [],
    getAllThreads: () => [],
    allMessages: new ObservableReactValue([]),
    branch: new ObservableReactValue([]),
    getListener: () => undefined,
  });

  React.useMemo(() => {
    if (userApiRef) {
      const {getListener, branch, allMessages, updateScrollButtonState, ...otherProps} = apiRef.current;
      userApiRef.current = otherProps;
    }
  }, [userApiRef]);

  return apiRef;
}
