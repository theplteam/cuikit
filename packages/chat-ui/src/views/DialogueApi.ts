import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { DMessage, Message } from '../models/Message';
import { DialogueMessages } from '../models/DialogueMessages';

export type DialogueListenersMap<DM extends DMessage> = {
  allMessages: ObservableReactValue<Message<DM>[]>;
  branch: ObservableReactValue<Message<DM>[]>;
  isTyping: ObservableReactValue<boolean>;
};

export type DialogueApi<DM extends DMessage> = {
  allMessages: ObservableReactValue<Readonly<Message<DM>[]>>;
  branch: ObservableReactValue<Readonly<Message<DM>[]>>;
  getListener: <K extends keyof DialogueListenersMap<DM>>(key: K) => DialogueListenersMap<DM>[K] | undefined;
  handleChangeBranch: DialogueMessages<DM>['handleChangeBranch'];
  setProgressStatus: (status: string) => void;
};

export const getDialogueMockApi = <DM extends DMessage>(): DialogueApi<DM> => ({
  allMessages: new ObservableReactValue([]),
  branch: new ObservableReactValue([]),
  handleChangeBranch: () => {},
  getListener: () => undefined,
  setProgressStatus: () => {},
});
