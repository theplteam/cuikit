import * as React from 'react';
import { Thread, ThreadModel } from '../../models';
import ThreadListItem from './ThreadListItem';
import { useObserverValue } from '../hooks/useObserverValue';
import { Threads } from '../../models/Threads';
import { HistorySlotType } from '../core/history/HistoryType';

type Props = {
  thread: ThreadModel;
  setThread: (thread: Thread) => void;
  model: Threads<any, any>;
  slots: Pick<HistorySlotType, 'threadsListItem'> & Pick<HistorySlotType, 'baseListItemText'> & Pick<HistorySlotType, 'threadListItemMenuButton'>;
};

const ThreadListItemObserver: React.FC<Props> = ({ thread, setThread, model, slots }) => {
  const currentThread = useObserverValue(model.currentThread);

  return (
    <ThreadListItem
      selected={thread.id === currentThread?.id}
      setThread={setThread}
      thread={thread}
      listModel={model.listGroups}
      model={model}
      slots={slots}
    />
  );
}

export default ThreadListItemObserver;
