import * as React from 'react';
import { Thread, ThreadModel } from '../../models/ThreadModel';
import { useObserverValue } from '../hooks/useObserverValue';
import { ThreadListCache } from '../../models/ThreadListCache';
import { MoreVertIcon } from '../../icons';
import { historyClassNames } from '../core/history/historyClassNames';
import clsx from 'clsx';
import { HistorySlotType } from '../core/history/HistoryType';
import HistoryModel from '../core/history/HistoryModel';

type Props = {
  thread: ThreadModel;
  selected: boolean;
  setThread: (thread: Thread) => void;
  listModel: ThreadListCache;
  historyModel: HistoryModel;
  slots: Pick<HistorySlotType, 'threadsListItem'> & Pick<HistorySlotType, 'baseListItemText'> & Pick<HistorySlotType, 'threadListItemMenuButton'>;
};

const ThreadListItem: React.FC<Props> = ({ thread, selected, setThread, listModel, historyModel, slots }) => {
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
    historyModel.menuDriverOpen.value = false;
    setThread(thread.data);
  }

  return (
    <slots.threadsListItem
      className={clsx(historyClassNames.listItem, { [historyClassNames.listItemSelected]: selected })}
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
    </slots.threadsListItem>
  );
};

export default React.memo(ThreadListItem, (prevProps, nextProps) => {
  return prevProps.selected === nextProps.selected && prevProps.thread.id === nextProps.thread.id;
});
