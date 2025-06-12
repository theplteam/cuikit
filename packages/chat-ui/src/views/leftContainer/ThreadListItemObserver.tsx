import * as React from 'react';
import { ThreadModel } from '../../models';
import ThreadListItem from './ThreadListItem';
import { useObserverValue } from '../hooks/useObserverValue';
import { Threads } from '../../models/Threads';

type Props = {
  thread: ThreadModel;
  setThread: (thread: ThreadModel['data']['data']) => void;
  model: Threads<any, any>;
};

const ThreadListItemObserver: React.FC<Props> = ({ thread, setThread, model }) => {
  const currentThread = useObserverValue(model.currentThread);

  return (
    <ThreadListItem
      selected={thread.id === currentThread?.id}
      setThread={setThread}
      thread={thread}
      listModel={model.listGroups}
    />
  );
}

export default ThreadListItemObserver;
