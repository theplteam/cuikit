import * as React from 'react';
import { Threads } from '../../models/Threads';
import { IdType } from '../../types';
import { Thread, ThreadModel } from '../../models';
import { ChatPropsTypes } from './useChatProps';
import { ApiManager } from './useApiManager';
import historyModel from './history/HistoryModel';

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

    const handleDeleteThread = (id: IdType) => {
      model.delete(id);
    };

    const getThreadById = (id: IdType) => {
      return model.get(id);
    };

    const getCurrentThread = () => {
      return model.currentThread.value?.data;
    };

    const internal = {
      handleCreateNewThread: props.handleCreateNewThread ?? ThreadModel.createEmptyData,
      onChangeCurrentThread: props.onChangeCurrentThread,
      onThreadDeleted: props.onThreadDeleted,
    };

    historyModel.threadsModel.value = model;
    apiManager.setMethod('onChangeThread', onChangeThread);
    apiManager.setMethod('getAllThreads', getAllThreads);
    apiManager.setMethod('openNewThread', openNewThread);
    apiManager.setMethod('deleteThread', handleDeleteThread);
    apiManager.setMethod('getCurrentThread', getCurrentThread);
    apiManager.setMethod('getThreadById', getThreadById);
    apiManager.setMethod('_internal', internal);
  }, [props, model]);
}
