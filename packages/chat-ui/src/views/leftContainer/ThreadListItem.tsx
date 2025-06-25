import * as React from 'react';
import { Thread, ThreadModel } from '../../models/ThreadModel';
import { useObserverValue } from '../hooks/useObserverValue';
import { ThreadListCache } from '../../models/ThreadListCache';
import { MoreVertIcon } from '../../icons';
import { historyClassNames } from '../core/history/historyClassNames';
import { HistorySlotType } from '../core/history/HistoryType';
import { Threads } from '../../models/Threads';

type Props = {
  model: Threads<any, any>;
  thread: ThreadModel;
  selected: boolean;
  setThread: (thread: Thread) => void;
  listModel: ThreadListCache;
  slots: Pick<HistorySlotType, 'baseListItemText' | 'threadListItemMenuButton'>;
};

const ThreadListItem: React.FC<Props> = ({ model, thread, selected, setThread, listModel, slots }) => {
  const handleClick = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    listModel.menuConfig.value = {
      anchorEl: event.currentTarget,
      thread,
    };
    event.preventDefault();
    event.stopPropagation();
  }, [listModel]);

  const isEmpty = useObserverValue(thread.isEmpty);
  const title = useObserverValue(thread.observableTitle);

  if (isEmpty) return null;

  const handleClickListItem = () => {
    model.menuDrawerOpen.value = false;
    setThread(thread.data);
  };

  const classes = [historyClassNames.listItem];
  if (selected) {
    classes.push(historyClassNames.listItemSelected);
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
      >
        <MoreVertIcon />
      </slots.threadListItemMenuButton>
    </div>
  );
};

export default React.memo(ThreadListItem, (prevProps, nextProps) => {
  return prevProps.selected === nextProps.selected && prevProps.thread.id === nextProps.thread.id;
});
