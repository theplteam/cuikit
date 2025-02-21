import { ThreadModel } from '../../models/ThreadModel';
import { Thread, DMessage } from '../../models';
import { PrivateApiRefType } from '../core/useApiRef';

export const getThreadListeners: <DM extends DMessage, DD extends Thread<DM>>(dialogue: ThreadModel<DM, DD>) => PrivateApiRefType<DM>['getListener'] = (dialogue) =>
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
