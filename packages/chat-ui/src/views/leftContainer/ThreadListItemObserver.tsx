import * as React from 'react';
import { Thread, ThreadModel } from '../../models';
import ThreadListItem from './ThreadListItem';
import { CoreSlots, SlotsTypeEase } from '../core/usePropsSlots';
import { useObserverValue } from '../hooks/useObserverValue';
import { Threads } from '../../models/Threads';

type Props = {
  thread: ThreadModel;
  setThread: (thread: Thread) => void;
  model: Threads<any, any>;
  slots: Pick<SlotsTypeEase, 'threadListItemMenuButton'> & Pick<CoreSlots, 'listItemText'>;
};

const ThreadListItemObserver: React.FC<Props> = ({ thread, setThread, model, slots }) => {
  const currentThread = useObserverValue(model.currentThread);

  return (
    <ThreadListItem
      selected={thread.id === currentThread?.id}
      setThread={setThread}
      thread={thread}
      listModel={model.listGroups}
      slots={slots}
    />
  );
}

export default ThreadListItemObserver;
