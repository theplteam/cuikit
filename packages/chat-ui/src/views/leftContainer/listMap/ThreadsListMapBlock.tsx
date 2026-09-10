import * as React from 'react';
import type SimpleBarCore from 'simplebar-core';
import { Thread, ThreadModel } from '../../../models';
import { EMPTY_PROJECTION, rowKey } from '../../../models/ThreadListGroupItem';
import HistorySkeleton from '../HistorySkeleton';
import ThreadDeleteConfirm from '../ThreadDeleteConfirm';
import ThreadRenameDialog from '../ThreadRenameDialog';
import ThreadListBody from './ThreadListBody';
import ThreadListItemMenu from '../ThreadListItemMenu';
import { useObserverValue } from '../../hooks/useObserverValue';
import { useHistoryContext } from '../../core/history/HistoryContext';

type Props = {
  scrollbar: SimpleBarCore | null;
  scrollElement: HTMLElement | null;
  viewportElement: HTMLElement | null;
};

const EMPTY_THREADS: ThreadModel[] = [];

const ThreadsListMapBlock: React.FC<Props> = ({ scrollbar, scrollElement, viewportElement }) => {
  const { apiRef, loading, slots, slotProps, internal, locale } = useHistoryContext();
  const model = internal?.model;

  const threads = useObserverValue(model?.list) ?? EMPTY_THREADS;

  // `Threads.list` is only ever replaced, never mutated, so array identity is a
  // correct O(1) dependency. The previous key was `arrayPluck(threads, 'id')
  // .join(',')`, which allocated a thousand-element array and a ~20KB string on
  // every render of this component.
  React.useEffect(() => {
    model?.listGroups.audit(locale, threads);
  }, [locale, model, threads]);

  const projection = useObserverValue(model?.listGroups.projection) ?? EMPTY_PROJECTION;

  // One subscription for the whole list instead of one per row.
  const currentThread = useObserverValue(model?.currentThread);
  const currentThreadKey = currentThread ? rowKey(currentThread) : undefined;

  const setThread = React.useCallback((thread: Thread) => {
    if (model?.currentThread.value?.id !== thread.id) {
      apiRef.current?.onChangeCurrentThread?.({ thread });
      apiRef.current?.onChangeThread(thread.id);
    }
  }, [apiRef, model]);

  return (
    <>
      <slots.threadsList {...slotProps.threadsList}>
        {(loading || !model) ? (
          <HistorySkeleton />
        ) : (
          <ThreadListBody
            currentThreadKey={currentThreadKey}
            model={model}
            projection={projection}
            scrollbar={scrollbar}
            scrollElement={scrollElement}
            slotProps={slotProps}
            slots={slots}
            viewportElement={viewportElement}
            setThread={setThread}
          />
        )}
      </slots.threadsList>
      {!!model && <ThreadListItemMenu model={model} />}
      <ThreadDeleteConfirm />
      <ThreadRenameDialog />
    </>
  );
}

export default ThreadsListMapBlock;
