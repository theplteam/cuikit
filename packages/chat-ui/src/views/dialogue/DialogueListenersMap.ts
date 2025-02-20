import type { ObservableReactValue } from "../../utils/observers";
import type { DMessage, Message } from "../../models";

export type DialogueListenersMap<DM extends DMessage> = {
  allMessages: ObservableReactValue<Message<DM>[]>;
  branch: ObservableReactValue<Message<DM>[]>;
  isTyping: ObservableReactValue<boolean>;
};
