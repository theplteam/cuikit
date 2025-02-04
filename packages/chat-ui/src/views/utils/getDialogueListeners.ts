import { DialogueApi } from '../DialogueApi';
import { DialogueAbstract } from '../../models/DialogueAbstract';

export const getDialogueListeners: (dialogue: DialogueAbstract) => DialogueApi['getListener'] = (dialogue) =>
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
