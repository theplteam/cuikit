import * as React from 'react';
import { Thread, ThreadModel } from '../../models';
import { useObserverValue } from '../hooks/useObserverValue';
import { ThreadListCache } from '../../models/ThreadListCache';
import { MoreVertIcon } from '../../icons';
import { historyClassNames } from '../core/history/historyClassNames';
import { HistorySlotType } from '../core/history/HistoryType';
import { useHistoryContext } from '../core/history/HistoryContext';
import { Threads } from '../../models/Threads';

type Props = {
  model: Threads<any, any>;
  thread: ThreadModel;
  selected: boolean;
  setThread: (thread: Thread) => void;
  listModel: ThreadListCache;
  slots: Pick<HistorySlotType, 'listItemRoot' | 'baseListItemText' | 'threadListItemMenuButton'>;
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
  const { threadTypeIcons } = useHistoryContext();
  const threadType = thread.data.type;
  const icon = threadType && threadTypeIcons ? threadTypeIcons[threadType] : undefined;

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
    <slots.listItemRoot
      threadId={thread.id}
      className={classes.join(' ')}
      onClick={handleClickListItem}
    >
      {icon}
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
    </slots.listItemRoot>
  );
};

export default React.memo(ThreadListItem, (prevProps, nextProps) => {
  return prevProps.selected === nextProps.selected && prevProps.thread.id === nextProps.thread.id;
});
