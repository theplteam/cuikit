import * as React from 'react';
import { ThreadModel } from '../../models';
import { Threads } from '../../models/Threads';
import { useObserverValue } from '../hooks/useObserverValue';
import ThreadListItem from './ThreadListItem';

type Props = {
  thread: ThreadModel;
  model: Threads<any, any>;
  setThread: (thread: ThreadModel['data']['data']) => void;
};

const ThreadListItemObserver: React.FC<Props> = ({ thread, setThread, model }) => {
  const currentThread = useObserverValue(model.currentThread);

  return (
    <ThreadListItem
      currentThread={currentThread}
      setThread={setThread}
      thread={thread}
    />
  );
}

export default ThreadListItemObserver;
