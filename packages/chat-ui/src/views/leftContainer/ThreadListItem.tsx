import * as React from 'react';
import { Thread, ThreadModel } from '../../models/ThreadModel';
import { useObserverValue } from '../hooks/useObserverValue';
import { ThreadListCache } from '../../models/ThreadListCache';
import { MoreVertIcon } from '../../icons';
import { useThreadListContext } from '../core/threadList/ThreadListContext';
import { threadListClassNames } from '../core/threadList/threadListClassNames';
import clsx from 'clsx';

type Props = {
  thread: ThreadModel;
  selected: boolean;
  setThread: (thread: Thread) => void;
  listModel: ThreadListCache;
};

const ThreadListItem: React.FC<Props> = ({ thread, selected, setThread, listModel }) => {
  const handleClick = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    listModel.menuConfig.value = {
      anchorEl: event.currentTarget,
      thread,
    };
    event.preventDefault();
    event.stopPropagation();
  }, [listModel]);

  const { slots, slotProps, threadListModel } = useThreadListContext();

  const isEmpty = useObserverValue(thread.isEmpty);
  const title = useObserverValue(thread.observableTitle);

  if (isEmpty) return null;

  const handleClickListItem = () => {
    threadListModel.menuDriverOpen.value = false;
    setThread(thread.data);
  }

  return (
    <slots.threadsListItem
      {...slotProps.threadsListItem}
      className={clsx(threadListClassNames.threadListItem, { [threadListClassNames.threadListItemSelected]: selected }, slotProps.threadsListItem?.className)}
      onClick={handleClickListItem}
    >
      <slots.baseListItemText
        primary={title ?? 'TITLE'}
        sx={{
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
        {...slotProps.baseListItemText}
      />
      <slots.threadListItemMenuButton
        size="small"
        sx={{
          position: 'absolute',
          right: (theme) => theme.spacing(1.5),
          top: '50%',
          transform: 'translateY(-50%)',
        }}
        threadId={thread.id}
        onClick={handleClick}
        {...slotProps.threadListItemMenuButton}
      >
        <MoreVertIcon />
      </slots.threadListItemMenuButton>
    </slots.threadsListItem>
  );
};

export default React.memo(ThreadListItem, (prevProps, nextProps) => {
  return prevProps.selected === nextProps.selected && prevProps.thread.id === nextProps.thread.id;
});
