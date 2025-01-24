import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { ChatMessage } from '../models/ChatMessage';
import { DialogueMessages } from '../models/DialogueMessages';

export type DialogueListenersMap = {
  allMessages: ObservableReactValue<ChatMessage[]>;
  branch: ObservableReactValue<ChatMessage[]>;
  isTyping: ObservableReactValue<boolean>;
};

export type DialogueApi = {
  allMessages: Readonly<ChatMessage[]>;
  branch: Readonly<ChatMessage[]>;
  getListener: <K extends keyof DialogueListenersMap>(key: K) => DialogueListenersMap[K] | undefined;
  handleChangeBranch: DialogueMessages['handleChangeBranch'];
};

export const getDialogueMockApi = (): DialogueApi => ({
  allMessages: [],
  branch: [],
  handleChangeBranch: (message) => {},
  getListener: (key) => undefined,
});
