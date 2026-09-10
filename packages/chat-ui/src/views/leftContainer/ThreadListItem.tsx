import * as React from 'react';
import { Thread, ThreadModel } from '../../models';
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
  /**
   * Resolved once by the list body instead of per row: reading it from the
   * history context here made every row a context consumer.
   *
   * Deliberately absent from the memo comparator below — consumers usually pass
   * an inline `threadTypeIcons` object, and comparing it would defeat the memo
   * entirely. The tradeoff is that swapping icons at runtime does not repaint
   * already-mounted rows, which is already true of `slots`.
   */
  icon?: React.ReactElement;
  slots: Pick<HistorySlotType, 'listItemRoot' | 'baseListItemText' | 'threadListItemMenuButton'>;
};

const ThreadListItem: React.FC<Props> = ({ model, thread, selected, setThread, listModel, icon, slots }) => {
  const handleClick = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    listModel.menuConfig.value = {
      anchorEl: event.currentTarget,
      thread,
    };
    event.preventDefault();
    event.stopPropagation();
  }, [listModel]);

  const title = useObserverValue(thread.observableTitle);

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
        className={historyClassNames.listItemText}
        primary={title ?? 'TITLE'}
      />
      <slots.threadListItemMenuButton
        className={historyClassNames.listItemMenuButton}
        size="small"
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
