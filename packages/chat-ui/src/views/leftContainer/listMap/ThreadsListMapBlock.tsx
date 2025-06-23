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
  const { apiRef, loading, slots, slotProps, historyModel, threadsModel } = useHistoryContext();
  const internal = apiRef.current?._internal;
  const threads = useObserverValue(threadsModel?.list) ?? [];
  const groupsMap = useThreadsList(threads, threadsModel) ?? {};

  const setThread = (thread: Thread) => {
    if (threadsModel?.currentThread.value?.id !== thread.id) {
      internal?.onChangeCurrentThread?.({ thread });
      apiRef.current?.onChangeThread(thread.id);
    }
  };

  return (
    <>
      <slots.threadsList {...slotProps.threadsList}>
        {(loading || !threadsModel) ? (
          <HistorySkeleton />
        ) : (
          <>
            {groupsMap.map((groupModel, key) => (
              <ThreadListMapBlockGroupItem
                key={groupModel.data.id}
                listGroupItem={groupModel}
                setThread={setThread}
                index={key}
                model={threadsModel}
                slots={slots}
                historyModel={historyModel}
              />
            ))}
            <ThreadListItemMenu model={threadsModel} />
          </>
        )}
      </slots.threadsList>
      <ThreadDeleteConfirm />
    </>
  );
}

export default ThreadsListMapBlock;
