import * as React from 'react';
import { ThreadModel } from '../../models/ThreadModel';
import { useObserverValue } from '../hooks/useObserverValue';
import { ThreadListCache } from '../../models/ThreadListCache';
import { chatClassNames } from '../core/chatClassNames';
import { MoreVertIcon } from '../../icons';
import { useThreadListContext } from '../core/threadList/ThreadListContext';

type Props = {
  thread: ThreadModel;
  selected: boolean;
  setThread: (thread: ThreadModel['data']['data']) => void;
  listModel: ThreadListCache;
};

const classSelected = 'boxSelected';

const ThreadListItem: React.FC<Props> = ({ thread, selected, setThread, listModel }) => {
  const handleClick = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    listModel.menuConfig.value = {
      anchorEl: event.currentTarget,
      thread,
    };
    event.preventDefault();
    event.stopPropagation();
  }, [listModel]);

  const { apiRef, slots, slotProps } = useThreadListContext();

  const isEmpty = useObserverValue(thread.isEmpty);
  const title = useObserverValue(thread.data.observableTitle);

  if (isEmpty) return null;

  const handleClickListItem = () => {
    apiRef.current?.setMenuDriverOpen(false);
    setThread(thread.data.data);
  }

  const classes = [chatClassNames.threadListItem];
  if (selected) {
    classes.push(classSelected);
  }

  return (
    <div
      className={classes.join(' ')}
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
        onClick={handleClick}
        {...slotProps.threadListItemMenuButton}
      >
        <MoreVertIcon />
      </slots.threadListItemMenuButton>
    </div>
  );
};

export default React.memo(ThreadListItem, (prevProps, nextProps) => {
  return prevProps.selected === nextProps.selected && prevProps.thread.id === nextProps.thread.id;
});
