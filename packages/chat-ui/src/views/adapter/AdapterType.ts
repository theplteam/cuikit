import { DDialogue, DMessage } from "../../models";

export type AdapterType<D = any, M = any> = {
  transformDialogue?: (dialogue: D) => DDialogue;
  transformMessage?: (message: M) => DMessage;
};
