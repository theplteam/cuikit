import * as React from 'react';
import { useMessageProgressStatus } from './useMessageProgressStatus';
import { Dialogue } from '../../models/Dialogue';
import { ApiManager } from '../core/useApiManager';
import { getDialogueListeners } from '../utils/getDialogueListeners';
import { useDialogueSendMessage } from './useDialogueSendMessage';

export const useDialogueApiInitialization = (
  dialogue: Dialogue | undefined,
  apiManager: ApiManager,
  onMessageSend: ReturnType<typeof useDialogueSendMessage>,
) => {
  const handleChangeStreamStatus = useMessageProgressStatus(dialogue);

  React.useMemo(() => {
    apiManager.setMethod('setProgressStatus', handleChangeStreamStatus);
  }, [handleChangeStreamStatus]);

  React.useMemo(() => {
    apiManager.setMethod('sendUserMessage', onMessageSend);
  }, [onMessageSend]);

  React.useMemo(() => {
    if (!dialogue) return;

    const messages = dialogue.messages;

    apiManager.setMethods({
      getAllMessages: () => messages.allMessages.value.map(v => v.data),
      getBranchMessages: () => messages.currentMessages.value.map(v => v.data),
      handleChangeBranch: messages.handleChangeBranch,
      setProgressStatus: handleChangeStreamStatus,
    });

    const privateApi = apiManager.apiRef.current;
    if (privateApi) {
      privateApi.dialogue = {
        allMessages: messages.allMessages,
        branch: messages.currentMessages,
        getListener: getDialogueListeners(dialogue),
        handleChangeBranch: messages.handleChangeBranch,
      };
    }
    apiManager.apiRef.current?.dialogue
  }, [dialogue]);
}
