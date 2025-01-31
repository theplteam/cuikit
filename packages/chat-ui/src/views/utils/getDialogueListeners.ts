import { DialogueApi } from '../DialogueApi';
import { Dialogue } from '../../models/dialogue/Dialogue';

export const getDialogueListeners: (dialogue: Dialogue) => DialogueApi['getListener'] = (dialogue) =>
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
