import * as React from 'react';
import { useChatContext } from '../../core/ChatGlobalContext';
import { useChatSlots } from '../../core/ChatSlotsContext';
import { Thread } from '../../../models';
import HistorySkeleton from '../HistorySkeleton';
import ThreadDeleteConfirm from '../ThreadDeleteConfirm';
import { useThreadsList } from './useThreadsList';
import ThreadListMapBlockGroupItem from './ThreadListMapBlockGroupItem';
import ThreadListItemMenu from '../ThreadListItemMenu';
import ThreadListMapBlockAllStyled from './ThreadListMapBlockAllStyled';
import { useObserverValue } from '../../hooks/useObserverValue';

const ThreadsListMapBlock: React.FC = () => {
  const { loading, apiRef, onChangeCurrentThread, model } = useChatContext();
  const { slots, slotProps } = useChatSlots();
  const threads = useObserverValue(model.list) ?? [];
  const groupsMap = useThreadsList(threads, model) ?? {};

  const setThread = (thread: Thread) => {
    if (model.currentThread.value?.id !== thread.id) {
      onChangeCurrentThread?.({ thread });
      apiRef.current?.onChangeThread(thread.id);
    }
  };

  return (
    <>
      <ThreadListMapBlockAllStyled position="relative">
        {loading ? <HistorySkeleton /> : null}
        {!loading && groupsMap.map((groupModel, key) => (
          <ThreadListMapBlockGroupItem
            key={groupModel.data.id}
            listGroupItem={groupModel}
            slot={slots.listTimeText}
            slotProps={slotProps.listTimeText}
            setThread={setThread}
            index={key}
            model={model}
          />
          ))}
        <ThreadListItemMenu model={model} />
      </ThreadListMapBlockAllStyled>
      <ThreadDeleteConfirm />
    </>
  );
}

export default ThreadsListMapBlock;
