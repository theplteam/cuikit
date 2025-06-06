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
    const getAllThreads = () => model.list.value.map(v => v.data);

    const onChangeThread = async (threadId: IdType) => {
      const threadModel = model.get(threadId);
      model.currentThread.value = threadModel;

      if (!!threadModel && !!threadModel.isLoadingFullData.value && !!props.getFullThread) {
        let fullThread = props.getFullThread(threadModel.id);

        if (fullThread instanceof Promise) {
          fullThread = await fullThread;
        }

        if (fullThread) {
          threadModel.setFullData(fullThread);
        }
      }

      if (threadModel?.isLoadingFullData.value) {
        threadModel.isLoadingFullData.value = false;
      }
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
      return model.currentThread.value?.data;
    };

    apiManager.setMethod('onChangeThread', onChangeThread);
    apiManager.setMethod('getAllThreads', getAllThreads);
    apiManager.setMethod('openNewThread', openNewThread);
    apiManager.setMethod('deleteThread', handleDeleteThread);
    apiManager.setMethod('getCurrentThread', getCurrentThread);
    apiManager.setMethod('setDeleteThreadItem', setDeleteThreadItem);
    apiManager.setMethod('setMenuDriverOpen', setMenuDriverOpen);
    apiManager.setMethod('getThreadById', getThreadById);

  }, [props, model]);
}
