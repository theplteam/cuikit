import * as React from 'react';
import TimeGroupItem from '../TimeGroupItem';
import Box from '@mui/material/Box';
import ThreadListItemObserver from '../ThreadListItemObserver';
import { ThreadListGroupItem } from '../../../models/ThreadListGroupItem';
import { SlotsType } from '../../core/usePropsSlots';
import { SlotPropsType } from '../../core/SlotPropsType';
import { useObserverValue } from '../../hooks/useObserverValue';
import { Message, Thread } from '../../../models';
import { Threads } from '../../../models/Threads';
import DelayRenderer from '../../../ui/DelayRenderer';

type Props<DM extends Message = any, DD extends Thread = any> = {
  listGroupItem: ThreadListGroupItem;
  slot: SlotsType<DM, DD>['listTimeText'];
  slotProps: SlotPropsType<DM, DD>['listTimeText'] | undefined;
  model: Threads<DM, DD>;
  setThread: (thread: Thread) => void;
  index: number;
};

const ThreadListMapBlockGroupItem: React.FC<Props> = ({ listGroupItem, slotProps, slot, model, setThread, index }) => {
  const threads = useObserverValue(listGroupItem.threads) ?? [];

  console.log('render', listGroupItem.data.id, threads.length);
  const list = React.useMemo(() => threads.map((thread) => (
    <Box key={thread.id}>
      <ThreadListItemObserver
        model={model}
        setThread={setThread}
        thread={thread}
      />
    </Box>
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
