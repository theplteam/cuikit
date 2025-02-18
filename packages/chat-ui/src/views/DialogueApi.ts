import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { DMessage, Message } from '../models/Message';
import { DialogueMessages } from '../models/DialogueMessages';

export type DialogueListenersMap<DM extends DMessage> = {
  allMessages: ObservableReactValue<Message<DM>[]>;
  branch: ObservableReactValue<Message<DM>[]>;
  isTyping: ObservableReactValue<boolean>;
};

export type DialogueApi<DM extends DMessage> = {
  /**
   * All messages in the current dialogue.
   */
  allMessages: ObservableReactValue<Readonly<Message<DM>[]>>;
  /**
   * All messages in the current dialogue branch.
   */
  branch: ObservableReactValue<Readonly<Message<DM>[]>>;
  getListener: <K extends keyof DialogueListenersMap<DM>>(key: K) => DialogueListenersMap<DM>[K] | undefined;
  handleChangeBranch: DialogueMessages<DM>['handleChangeBranch'];
  /**
   * Set your own waiting status for a chat response.
   */
  setProgressStatus: (status: string) => void;
};

export type DialogueApiUser<DM extends DMessage> = Omit<DialogueApi<DM>, 'getListener'>;

export const getDialogueMockApi = <DM extends DMessage>(): DialogueApi<DM> => ({
  allMessages: new ObservableReactValue([]),
  branch: new ObservableReactValue([]),
  handleChangeBranch: () => {},
  getListener: () => undefined,
  setProgressStatus: () => {},
});
