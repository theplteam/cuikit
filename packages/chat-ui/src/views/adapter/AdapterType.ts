import { Thread, ThreadHistoryItemType, Message } from "../../models";

export type AdapterType<D = any, M = any> = {
  transformThread: (thread: D) => Thread;
  /**
   * Transform message to our format. It will be ignored if `transformThread` was passed.
   * @param message
   */
  transformMessage?: (message: M) => Message;
  /**
   *  Function is used in onFinish in the parameters of sending a message.
   *  With its help you can change the format of the message that the chat returns.
   */
  messageOutputFormat?: (message: Message) => M;
  transformHistory?: <T>(history: ThreadHistoryItemType[]) => T[];
};
