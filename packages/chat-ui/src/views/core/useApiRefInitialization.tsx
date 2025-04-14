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
    const getAllThreads = () => model.list.value.map(v => v.data.data);

    const onChangeThread = (threadId: IdType) => {
      model.currentThread.value = model.get(threadId);
    };

    const openNewThread = (thread: Thread) => {
      if (!thread.isNew) {
        thread.isNew = true;
      }
      model.currentThread.value = model.createFromData(thread ?? ThreadModel.createEmptyData(), props.onUserMessageSent);;
    };

    const setMenuDriverOpen = (value: boolean) => {
      model.actions.menuDriverOpen.value = value;
    };

    const setDeleteThreadItem = (thread?: Thread) => {
      model.actions.deleteItem.value = thread;
    };

    const handleDeleteThread = (id: IdType) => {
      model.delete(id);
    };

    const getThreadById = (id: IdType) => {
      return model.get(id);
    };

    const getCurrentThread = () => {
      return model.currentThread.value?.data.data;
    };

    apiManager.setMethod('onChangeThread', onChangeThread);
    apiManager.setMethod('getAllThreads', getAllThreads);
    apiManager.setMethod('openNewThread', openNewThread);
    apiManager.setMethod('deleteThread', model.delete);
    apiManager.setMethod('getCurrentThread', getCurrentThread);
    apiManager.setMethod('setDeleteThreadItem', setDeleteThreadItem);
    apiManager.setMethod('setMenuDriverOpen', setMenuDriverOpen);
    apiManager.setMethod('handleDeleteThread', handleDeleteThread);
    apiManager.setMethod('getThreadById', getThreadById);

  }, [props, model]);
}
