import * as React from 'react';
import TimeGroupItem from '../TimeGroupItem';
import ThreadListItemObserver from '../ThreadListItemObserver';
import { ThreadListGroupItem } from '../../../models/ThreadListGroupItem';
import { useObserverValue } from '../../hooks/useObserverValue';
import { Thread } from '../../../models';
import { Threads } from '../../../models/Threads';
import DelayRenderer from '../../../ui/DelayRenderer';
import { HistorySlotType } from '../../core/history/HistoryType';

type Props = {
  listGroupItem: ThreadListGroupItem;
  setThread: (thread: Thread) => void;
  index: number;
  model: Threads<any, any>;
  slots: Pick<HistorySlotType, 'threadsListItem'> & Pick<HistorySlotType, 'baseListItemText'> & Pick<HistorySlotType, 'threadListItemMenuButton'>;
};

const ThreadListMapBlockGroupItem: React.FC<Props> = ({ listGroupItem, setThread, index, model, slots }) => {
  const threads = useObserverValue(listGroupItem.threads) ?? [];

  const list = React.useMemo(() => threads.map((thread) => (
    <ThreadListItemObserver
      key={thread.id}
      setThread={setThread}
      thread={thread}
      model={model}
      slots={slots}
    />
  )), [threads.length]);

  if (!threads.length) return null;

  return (
    <DelayRenderer once timeout={index * 50 + 20}>
      <TimeGroupItem
        key={listGroupItem.data.id}
        group={listGroupItem.data}
      />
      {list}
    </DelayRenderer>
  );
}

export default React.memo(ThreadListMapBlockGroupItem, (prev, next) => prev.listGroupItem.data.id === next.listGroupItem.data.id);
