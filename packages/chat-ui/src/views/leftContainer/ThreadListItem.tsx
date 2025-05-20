import * as React from 'react';
import { ThreadModel } from '../../models/ThreadModel';
import { useObserverValue } from '../hooks/useObserverValue';
import { useChatContext } from '../core/ChatGlobalContext';
import { ThreadListCache } from '../../models/ThreadListCache';
import { chatClassNames } from '../core/chatClassNames';
import { MoreVertIcon } from '../../icons';
import { CoreSlots, SlotsTypeEase } from '../core/usePropsSlots';

type Props = {
  thread: ThreadModel;
  selected: boolean;
  setThread: (thread: ThreadModel['data']['data']) => void;
  listModel: ThreadListCache;
  slots: Pick<SlotsTypeEase, 'threadListItemMenuButton'> & Pick<CoreSlots, 'listItemText'>;
};

const classSelected = 'boxSelected';
const classShadowRight = 'shadowRight';

const ThreadListItem: React.FC<Props> = ({ thread, selected, setThread, listModel, slots }) => {
  const handleClick = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    listModel.menuConfig.value = {
      anchorEl: event.currentTarget,
      thread,
    };
    event.preventDefault();
    event.stopPropagation();
  }, [listModel]);

  const { apiRef } = useChatContext();

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
      <slots.listItemText
        primary={title ?? 'TITLE'}
        sx={{
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      />
      <div className={`${chatClassNames.threadListItem} ${classShadowRight}`} />
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
