import * as React from 'react';
import { useMessageProgressStatus } from './useMessageProgressStatus';
import { ThreadModel } from '../../models/ThreadModel';
import { ApiManager } from '../core/useApiManager';
import { getThreadListeners } from '../utils/getThreadListeners';
import { useThreadSendMessage } from './useThreadSendMessage';
import { useConversationBlockHeightCallback } from './useConversationBlockHeightCallback';
import { IdType } from '../../types';

type OnMessageSendType = ReturnType<typeof useThreadSendMessage>['onSendNewsMessage'];
type OnEditMessageType = ReturnType<typeof useThreadSendMessage>['onEditMessage'];

export const useThreadApiInitialization = (
  thread: ThreadModel | undefined,
  apiManager: ApiManager,
  onMessageSend: OnMessageSendType,
  onEditMessage: OnEditMessageType,
  getConversationBlockHeightMin?: (calculatedHeight: number) => number,
) => {
  const handleChangeStreamStatus = useMessageProgressStatus(thread);

  const getConversationBlockHeight = useConversationBlockHeightCallback(getConversationBlockHeightMin);

  React.useMemo(() => {
    apiManager.setMethod('setProgressStatus', handleChangeStreamStatus);
  }, [handleChangeStreamStatus]);

  React.useMemo(() => {
    apiManager.setMethod('sendUserMessage', onMessageSend);
    apiManager.setPrivateMethod('onEditMessage', onEditMessage);
  }, [onMessageSend]);

  React.useMemo(() => {
    if (!thread) return;

    const messages = thread.messages;

    apiManager.setMethods({
      getAllMessages: () => messages.allMessages.value.map(v => v.data),
      getBranchMessages: () => messages.currentMessages.value.map(v => v.data),
      handleChangeBranch: messages.handleChangeBranch,
      setProgressStatus: handleChangeStreamStatus,
    });

    const setMessageText = (messageId: IdType, text: string) => {
      const message = thread.messages.allMessages.value.find(v => v.id === messageId);
      if (message?.texts?.value?.length) {
        message.texts.value[message.texts.value.length - 1].text = text;
      }
    }

    apiManager.setPrivateMethod('allMessages', messages.allMessages);
    apiManager.setPrivateMethod('branch', messages.currentMessages);
    apiManager.setPrivateMethod('getListener', getThreadListeners(thread));
    apiManager.setMethod('getProgressStatus', () => thread.streamStatus.value ?? '');
    apiManager.setMethod('setMessageText', setMessageText);

  }, [thread]);

  React.useMemo(() => {
    apiManager.setPrivateMethod('getConversationBlockHeight', getConversationBlockHeight);
  }, [getConversationBlockHeight]);
}
