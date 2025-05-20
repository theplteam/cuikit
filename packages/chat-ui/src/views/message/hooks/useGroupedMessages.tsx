import * as React from 'react';
import { ChatMessageOwner, MessageModel } from '../../../models';

export const useGroupedMessages = (messages: MessageModel[]) => {
  return React.useMemo(() => {
    if (!messages || messages.length === 0) {
      return [];
    }

    const groups: MessageModel[][]  = [];
    let currentGroup: MessageModel[] = [];

    for (const message of messages) {
      if (message.role === ChatMessageOwner.USER) {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
        }
        currentGroup = [message];
      } else if (message.role === ChatMessageOwner.ASSISTANT) {
        if (currentGroup.length > 0 && currentGroup[0].role === ChatMessageOwner.USER) {
          currentGroup.push(message);
        }
      }
    }

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }, [messages]);
}
