import { ThreadModel } from '../../models/ThreadModel';
import { Thread, Message } from '../../models';
import { PrivateApiRefType } from '../core/useApiRef';

export const getThreadListeners: <DM extends Message, DD extends Thread<DM>>(thread: ThreadModel<DM, DD>) => PrivateApiRefType<DM>['getListener'] = (thread) =>
  (key) => {
  // TODO: #ANY
  let value: any;
  switch (key) {
    case "allMessages": value = thread.messages.allMessages;break;
    case "branch": value = thread.messages.currentMessages;break;
    case "isTyping": value = thread.isTyping;break;
  }

  return value;
}
