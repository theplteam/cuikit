import { Thread, Message, InternalMessageType } from "../../models";

export type AdapterType<D = any, M = any> = {
  transformThread: (thread: D) => Thread;
  /**
   * Transform message to our format. It will be ignored if `transformThread` was passed.
   * @param message
   */
  transformMessage?: (message: M) => Message;
  reverseMessageTransforming?: (message: Message) => InternalMessageType;
};
