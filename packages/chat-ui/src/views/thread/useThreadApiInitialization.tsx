import * as React from 'react';
import { ThreadModel } from '../../models/ThreadModel';
import { ApiManager } from '../core/useApiManager';
import { getThreadListeners } from '../utils/getThreadListeners';
import { useThreadSendMessage } from './useThreadSendMessage';
import { useConversationBlockHeightCallback } from './useConversationBlockHeightCallback';
import { IdType } from '../../types';
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

    const setMessageText = (text: string, messageId?: IdType) => {
      const currentMessages = thread.messages.currentMessages.value;
      const message = messageId ? currentMessages.find((m) => m.id === messageId) : arrayLast(currentMessages);
      if (message?.texts?.value?.length) {
        message.text = text;
      }
    };

    const setMessageStatus = (status: string | undefined, isTyping?: boolean, messageId?: IdType) => {
      const currentMessages = thread.messages.currentMessages.value;
      const message = messageId ? currentMessages.find((m) => m.id === messageId) : arrayLast(currentMessages);
      if (message) {
        message.status.value = status;
        message.typing.value = !!isTyping;
        thread.isTyping.value = !!isTyping;
      }
    };

    apiManager.setPrivateMethod('allMessages', messages.allMessages);
    apiManager.setPrivateMethod('branch', messages.currentMessages);
    apiManager.setPrivateMethod('getListener', getThreadListeners(thread));

    apiManager.setMethods({
      getAllMessages: () => messages.allMessages.value.map(v => v.data),
      getBranchMessages: () => messages.currentMessages.value.map(v => v.data),
      handleChangeBranch: messages.handleChangeBranch,
      setMessageText,
      setMessageStatus,
    });

  }, [thread]);

  React.useMemo(() => {
    apiManager.setPrivateMethod('getConversationBlockHeight', getConversationBlockHeight);
  }, [getConversationBlockHeight]);
}
