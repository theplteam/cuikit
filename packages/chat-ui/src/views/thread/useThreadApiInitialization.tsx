import * as React from 'react';
import { ThreadModel } from '../../models/ThreadModel';
import { ApiManager } from '../core/useApiManager';
import { getThreadListeners } from '../utils/getThreadListeners';
import { useThreadSendMessage } from './useThreadSendMessage';
import { useConversationBlockHeightCallback } from './useConversationBlockHeightCallback';
import { IdType } from '../../types';
import { ChatMessageOwner } from '../../models';
import { arrayLast } from '../../utils/arrayUtils/arrayLast';

type OnMessageSendType = ReturnType<typeof useThreadSendMessage>['onSendNewsMessage'];
type OnEditMessageType = ReturnType<typeof useThreadSendMessage>['onEditMessage'];

export const useThreadApiInitialization = (
  thread: ThreadModel | undefined,
  apiManager: ApiManager,
  onMessageSend: OnMessageSendType,
  onEditMessage: OnEditMessageType,
  getConversationBlockHeightMin?: (calculatedHeight: number) => number,
  contentRef?: React.RefObject<HTMLDivElement | null>,
) => {
  const getConversationBlockHeight = useConversationBlockHeightCallback(contentRef, getConversationBlockHeightMin);

  React.useMemo(() => {
    apiManager.setMethod('sendUserMessage', onMessageSend);
    apiManager.setPrivateMethod('onEditMessage', onEditMessage);
  }, [onMessageSend]);

  React.useMemo(() => {
    if (!thread) return;

    const messages = thread.messages;

    // Locate a message by id (current branch first, then all messages so that
    // statuses can target messages from inactive branches), or the last message
    // of the current branch when no id is given.
    const findMessage = (messageId?: IdType) => {
      const currentMessages = messages.currentMessages.value;
      if (messageId) {
        return currentMessages.find((m) => m.id === messageId)
          ?? messages.allMessages.value.find((m) => m.id === messageId);
      }
      return arrayLast(currentMessages);
    };

    const setMessageText = (text: string, messageId?: IdType) => {
      const message = findMessage(messageId);
      if (message?.texts?.value?.length) {
        message.text = text;
      }
    };

    const setMessageStatus = (status: string, isTyping?: boolean, messageId?: IdType) => {
      const message = findMessage(messageId);
      if (!message) return;

      message.status.value = status;

      if (isTyping !== undefined) {
        message.typing.value = isTyping;
        thread.isTyping.value = isTyping;
      }

      // Clearing a restored waiting-status: drop the persisted initialStatus so it
      // does not "resurrect" on the next load via getAllMessages().
      if (!status && isTyping === false && message.data.role === ChatMessageOwner.ASSISTANT) {
        message.data.initialStatus = undefined;
      }
    };

    apiManager.setMethods({
      getAllMessages: () => messages.allMessages.value.map(v => v.data),
      getBranchMessages: () => messages.currentMessages.value.map(v => v.data),
      handleChangeBranch: messages.handleChangeBranch,
      setMessageText,
      setMessageStatus,
    });

    apiManager.setPrivateMethod('allMessages', messages.allMessages);
    apiManager.setPrivateMethod('branch', messages.currentMessages);
    apiManager.setPrivateMethod('getListener', getThreadListeners(thread));

  }, [thread]);

  React.useMemo(() => {
    apiManager.setPrivateMethod('getConversationBlockHeight', getConversationBlockHeight);
  }, [getConversationBlockHeight]);
}
