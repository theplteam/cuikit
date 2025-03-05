import type { ObservableReactValue } from "../../utils/observers";
import type { Message, MessageModel } from "../../models";

export type ThreadListenersMap<DM extends Message> = {
  allMessages: ObservableReactValue<MessageModel<DM>[]>;
  branch: ObservableReactValue<MessageModel<DM>[]>;
  isTyping: ObservableReactValue<boolean>;
};
