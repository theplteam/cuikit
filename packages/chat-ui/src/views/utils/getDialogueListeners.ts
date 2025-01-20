import { DialogueApi } from '../DialogueApi';
import { ChatDialogue } from '../../models/ChatDialogue';

export const getDialogueListeners: (dialogue: ChatDialogue) => DialogueApi['getListener'] = (dialogue) =>
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
