import * as React from 'react';
import { Thread } from '../../../models';
import HistorySkeleton from '../HistorySkeleton';
import ThreadDeleteConfirm from '../ThreadDeleteConfirm';
import { useThreadsList } from './useThreadsList';
import ThreadListMapBlockGroupItem from './ThreadListMapBlockGroupItem';
import ThreadListItemMenu from '../ThreadListItemMenu';
import { useObserverValue } from '../../hooks/useObserverValue';
import { useThreadListContext } from '../../core/threadList/ThreadListContext';

const ThreadsListMapBlock: React.FC = () => {
  const { apiRef, loading, slots, slotProps } = useThreadListContext();
  const internal = apiRef.current?._internal;
  const threads = useObserverValue(internal?.model.list) ?? [];
  const groupsMap = useThreadsList(threads, internal?.model) ?? {};

  const setThread = (thread: Thread) => {
    if (internal?.model.currentThread.value?.id !== thread.id) {
      internal?.onChangeCurrentThread?.({ thread });
      apiRef.current?.onChangeThread(thread.id);
    }
  };

  if (!internal?.model) return null;

  return (
    <>
      <slots.threadsList {...slotProps.threadsList}>
        {loading ? <HistorySkeleton /> : null}
        {!loading && groupsMap.map((groupModel, key) => (
          <ThreadListMapBlockGroupItem
            key={groupModel.data.id}
            listGroupItem={groupModel}
            setThread={setThread}
            index={key}
            model={internal.model}
          />
        ))}
        <ThreadListItemMenu model={internal.model} />
      </slots.threadsList>
      <ThreadDeleteConfirm />
    </>
  );
}

export default ThreadsListMapBlock;
