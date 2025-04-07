import * as React from 'react';
import { useMessageProgressStatus } from './useMessageProgressStatus';
import { ThreadModel } from '../../models/ThreadModel';
import { ApiManager } from '../core/useApiManager';
import { getThreadListeners } from '../utils/getThreadListeners';
import { useThreadSendMessage } from './useThreadSendMessage';

export const useThreadApiInitialization = (
  thread: ThreadModel | undefined,
  apiManager: ApiManager,
  onMessageSend: ReturnType<typeof useThreadSendMessage>,
) => {
  const handleChangeStreamStatus = useMessageProgressStatus(thread);

  React.useMemo(() => {
    apiManager.setMethod('setProgressStatus', handleChangeStreamStatus);
  }, [handleChangeStreamStatus]);

  React.useMemo(() => {
    apiManager.setMethod('sendUserMessage', onMessageSend);
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

    apiManager.setPrivateMethod('allMessages', messages.allMessages);
    apiManager.setPrivateMethod('branch', messages.currentMessages);
    apiManager.setPrivateMethod('getListener', getThreadListeners(thread));
    apiManager.setMethod('getProgressStatus', () => thread.streamStatus.value ?? '');

  }, [thread]);
}
