import * as React from 'react';
import TimeGroupItem from '../TimeGroupItem';
import ThreadListItemObserver from '../ThreadListItemObserver';
import { ThreadListGroupItem } from '../../../models/ThreadListGroupItem';
import { SlotsType } from '../../core/usePropsSlots';
import { SlotPropsType } from '../../core/SlotPropsType';
import { useObserverValue } from '../../hooks/useObserverValue';
import { Message, Thread } from '../../../models';
import DelayRenderer from '../../../ui/DelayRenderer';
import { Threads } from '../../../models/Threads';
import { useChatSlots } from '../../core/ChatSlotsContext';

type Props<DM extends Message = any, DD extends Thread = any> = {
  listGroupItem: ThreadListGroupItem;
  slot: SlotsType<DM, DD>['listTimeText'];
  slotProps: SlotPropsType<DM, DD>['listTimeText'] | undefined;
  setThread: (thread: Thread) => void;
  index: number;
  model: Threads<any, any>
};

const ThreadListMapBlockGroupItem: React.FC<Props> = ({ listGroupItem, slotProps, slot, setThread, index, model }) => {
  const threads = useObserverValue(listGroupItem.threads) ?? [];
  const { slots, coreSlots } = useChatSlots();

  const list = React.useMemo(() => threads.map((thread) => (
    <ThreadListItemObserver
      key={thread.id}
      setThread={setThread}
      thread={thread}
      model={model}
      slots={{
        listItemText: coreSlots.listItemText,
        threadListItemMenuButton: slots.threadListItemMenuButton,
      }}
    />
  )), [threads.length]);

  if (!threads.length) return null;

  return (
    <DelayRenderer once timeout={index * 50 + 20}>
      <TimeGroupItem
        key={listGroupItem.data.id}
        group={listGroupItem.data}
        textComponent={slot}
        textComponentProps={slotProps}
      />
      {list}
    </DelayRenderer>
  );
}

export default React.memo(ThreadListMapBlockGroupItem, (prev, next) => prev.listGroupItem.data.id === next.listGroupItem.data.id);
