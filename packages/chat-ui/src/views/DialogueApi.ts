import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { ChatMessage } from '../models/ChatMessage';
import { DialogueMessages } from '../models/DialogueMessages';

export type DialogueListenersMap = {
  allMessages: ObservableReactValue<ChatMessage[]>;
  branch: ObservableReactValue<ChatMessage[]>;
  isTyping: ObservableReactValue<boolean>;
};

export type DialogueApi = {
  allMessages: ObservableReactValue<Readonly<ChatMessage[]>>;
  branch: ObservableReactValue<Readonly<ChatMessage[]>>;
  getListener: <K extends keyof DialogueListenersMap>(key: K) => DialogueListenersMap[K] | undefined;
  handleChangeBranch: DialogueMessages['handleChangeBranch'];
};

export const getDialogueMockApi = (): DialogueApi => ({
  allMessages: new ObservableReactValue([]),
  branch: new ObservableReactValue([]),
  handleChangeBranch: (message) => {},
  getListener: (key) => undefined,
});
