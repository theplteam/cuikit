import { Thread, DialogueHistoryItemType, DMessage } from "../../models";

export type AdapterType<D = any, M = any> = {
  transformThread: (thread: D) => Thread;
  /**
   * Transform message to our format. It will be ignored if `transformDialogue` was passed.
   * @param message
   */
  transformMessage?: (message: M) => DMessage;
  transformHistory?: <T>(history: DialogueHistoryItemType[]) => T[];
};
