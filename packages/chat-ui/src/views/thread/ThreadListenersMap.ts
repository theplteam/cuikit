import type { ObservableReactValue } from "../../utils/observers";
import type { DMessage, MessageModel } from "../../models";

export type ThreadListenersMap<DM extends DMessage> = {
  allMessages: ObservableReactValue<MessageModel<DM>[]>;
  branch: ObservableReactValue<MessageModel<DM>[]>;
  isTyping: ObservableReactValue<boolean>;
};
