import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { Message } from '../models/Message';
import { DialogueMessages } from '../models/DialogueMessages';

export type DialogueListenersMap = {
  allMessages: ObservableReactValue<Message[]>;
  branch: ObservableReactValue<Message[]>;
  isTyping: ObservableReactValue<boolean>;
};

export type DialogueApi = {
  allMessages: ObservableReactValue<Readonly<Message[]>>;
  branch: ObservableReactValue<Readonly<Message[]>>;
  getListener: <K extends keyof DialogueListenersMap>(key: K) => DialogueListenersMap[K] | undefined;
  handleChangeBranch: DialogueMessages['handleChangeBranch'];
};

export const getDialogueMockApi = (): DialogueApi => ({
  allMessages: new ObservableReactValue([]),
  branch: new ObservableReactValue([]),
  handleChangeBranch: (message) => {},
  getListener: (key) => undefined,
});
