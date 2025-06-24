import * as React from 'react';
import { Thread } from '../../../models';
import HistorySkeleton from '../HistorySkeleton';
import ThreadDeleteConfirm from '../ThreadDeleteConfirm';
import { useThreadsList } from './useThreadsList';
import ThreadListMapBlockGroupItem from './ThreadListMapBlockGroupItem';
import ThreadListItemMenu from '../ThreadListItemMenu';
import { useObserverValue } from '../../hooks/useObserverValue';
import { useHistoryContext } from '../../core/history/HistoryContext';

const ThreadsListMapBlock: React.FC = () => {
  const { apiRef, loading, slots, slotProps, internal } = useHistoryContext();
  const threads = useObserverValue(internal?.model.list) ?? [];
  const groupsMap = useThreadsList(threads, internal?.model) ?? {};

  const setThread = (thread: Thread) => {
    if (internal?.model?.currentThread.value?.id !== thread.id) {
      apiRef.current?.onChangeCurrentThread?.({ thread });
      apiRef.current?.onChangeThread(thread.id);
    }
  };

  return (
    <>
      <slots.threadsList {...slotProps.threadsList}>
        {(loading || !internal) ? (
          <HistorySkeleton />
        ) : (
          <>
            {groupsMap.map((groupModel, key) => (
              <ThreadListMapBlockGroupItem
                key={groupModel.data.id}
                listGroupItem={groupModel}
                setThread={setThread}
                index={key}
                model={internal.model}
                slots={slots}
              />
            ))}
            <ThreadListItemMenu model={internal.model} />
          </>
        )}
      </slots.threadsList>
      <ThreadDeleteConfirm />
    </>
  );
}

export default ThreadsListMapBlock;
