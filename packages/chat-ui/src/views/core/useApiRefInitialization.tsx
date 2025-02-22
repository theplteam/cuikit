import * as React from 'react';
import { Threads } from '../../models/Threads';
import { IdType } from '../../types';
import { Thread, ThreadModel } from '../../models';
import { ChatPropsTypes } from './useChatProps';
import { ApiManager } from './useApiManager';

export const useApiRefInitialization = (
  apiManager: ApiManager,
  model: Threads<any, any>,
  props: ChatPropsTypes<any, any>,
) => {
  React.useEffect(() => {
    const getAllDialogues = () => model.list.value.map(v => v.data.data);

    const onChangeDialogue = (threadId: IdType) => {
      model.currentThread.value = model.get(threadId);
    };

    const openNewThread = (thread?: Thread) => {
      const dialogueInstance = model.fromData(thread ?? ThreadModel.createEmptyData(), props.onUserMessageSent);
      model.currentThread.value = dialogueInstance;
    };

    apiManager.setMethod('onChangeThread', onChangeDialogue);
    apiManager.setMethod('getAllThreads', getAllDialogues);
    apiManager.setMethod('openNewThread', openNewThread);
    apiManager.setMethod('deleteThread', model.delete);
    apiManager.setMethod('getCurrentThread', () => model.currentThread.value?.data);
    // apiManager.setMethod('sendUserMessage', model.currentDialogue.)

  }, [props, model]);
}
