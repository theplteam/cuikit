import { DialogueApi } from '../DialogueApi';
import { Dialogue } from '../../models/Dialogue';
import { DDialogue, DMessage } from '../../models';

export const getDialogueListeners: <DM extends DMessage, DD extends DDialogue<DM>>(dialogue: Dialogue<DM, DD>) => DialogueApi<DM>['getListener'] = (dialogue) =>
  (key) => {
  // TODO: разобраться с типизацией
  let value: any;
  switch (key) {
    case "allMessages": value = dialogue.messages.allMessages;break;
    case "branch": value = dialogue.messages.currentMessages;break;
    case "isTyping": value = dialogue.isTyping;break;
  }

  return value;
}
