import { Dialogue } from '../../models/Dialogue';
import { DDialogue, DMessage } from '../../models';
import { PrivateApiRefType } from '../core/useApiRef';

export const getDialogueListeners: <DM extends DMessage, DD extends DDialogue<DM>>(dialogue: Dialogue<DM, DD>) => PrivateApiRefType<DM>['getListener'] = (dialogue) =>
  (key) => {
  // TODO: #ANY
  let value: any;
  switch (key) {
    case "allMessages": value = dialogue.messages.allMessages;break;
    case "branch": value = dialogue.messages.currentMessages;break;
    case "isTyping": value = dialogue.isTyping;break;
  }

  return value;
}
