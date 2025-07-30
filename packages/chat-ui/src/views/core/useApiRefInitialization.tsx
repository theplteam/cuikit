import * as React from 'react';
import { Threads } from '../../models/Threads';
import { IdType } from '../../types';
import { Thread, ThreadModel } from '../../models';
import { ChatPropsTypes } from './useChatProps';
import { ApiManager } from './useApiManager';
import internalApi from './history/internalApi';

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

    const setMenuDrawerOpen = (v: boolean) => {
      model.menuDrawerOpen.value = v;
    };

    const setDeleteItem = (v: any | undefined) => {
      model.deleteItem.value = v;
    };

    const setActiveTool = (v: string | undefined, threadId?: IdType) => {
      if (threadId) {
        const thread = model.list.value.find((t) => t.id === threadId);
        if (thread) thread.tool.value = v;
      } else if (model.currentThread.value) {
        model.currentThread.value.tool.value = v;
      }
      props.onToolChanged?.(v);
    };

    const setMessageStatus = (messageId: IdType, status: string | undefined, inProgress?: boolean) => {
      if (!model.currentThread.value) return;

      const message = model.currentThread.value.messagesArray.find((m) => m.id === messageId);
      if (!message) return;

      message.status.value = status;

      if (inProgress) {
        message.typing.value = inProgress;
        model.currentThread.value.isTyping.value = inProgress;
      }
    }

    internalApi.value = { model };

    apiManager.setMethod('setMessageStatus', setMessageStatus);
    apiManager.setMethod('setActiveTool', setActiveTool);
    apiManager.setMethod('setMenuDrawerOpen', setMenuDrawerOpen);
    apiManager.setMethod('setDeleteItem', setDeleteItem);
    apiManager.setMethod('handleCreateNewThread', props.handleCreateNewThread ?? ThreadModel.createEmptyData);
    apiManager.setMethod('onChangeCurrentThread', props.onChangeCurrentThread);
    apiManager.setMethod('onThreadDeleted', props.onThreadDeleted);
    apiManager.setMethod('onChangeThread', onChangeThread);
    apiManager.setMethod('getAllThreads', getAllThreads);
    apiManager.setMethod('openNewThread', openNewThread);
    apiManager.setMethod('deleteThread', handleDeleteThread);
    apiManager.setMethod('getCurrentThread', getCurrentThread);
    apiManager.setMethod('getThreadById', getThreadById);
    apiManager.setMethod('emitter', model.emitter.getMethods());
  }, [props, model]);
}
