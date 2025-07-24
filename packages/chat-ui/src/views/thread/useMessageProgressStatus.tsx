import * as React from 'react';
import { Thread, ThreadModel, Message } from '../../models';
import { arrayLast } from '../../utils/arrayUtils/arrayLast';

export const useMessageProgressStatus = <DM extends Message, DD extends Thread<DM>>(thread: ThreadModel<DM, DD> | undefined) => {
  return React.useCallback((status: string, inProgress?: boolean) => {
    if (thread) {
      thread.streamStatus.value = status;
      if (inProgress !== undefined) {
        const lastMessage = arrayLast(thread.messages.currentMessages.value);
        if (lastMessage) {
          lastMessage.typing.value = inProgress;
          thread.isTyping.value = inProgress;
        }
      }
    }
  }, [thread]);
}
