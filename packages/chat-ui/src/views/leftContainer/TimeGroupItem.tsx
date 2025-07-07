import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { ListGroupType } from './useThreadsGroupedList';
import { historyClassNames } from '../core/history/historyClassNames';
import { HistorySlotPropsType, HistorySlotType } from '../core/history/HistoryType';

type Props = {
  group?: ListGroupType;
  loading?: boolean;
  slotProps?: Partial<Pick<HistorySlotPropsType, 'listTimeTextWrapper' | 'listTimeText'>>;
  slots?: Pick<HistorySlotType, 'listTimeTextWrapper' | 'listTimeText'>;
};

const TimeGroupItem: React.FC<Props> = ({ group, loading, slots, slotProps }) => {
  if (loading || !slots) return <Skeleton variant="text" width={100} />

  return (
    <slots.listTimeTextWrapper {...slotProps?.listTimeTextWrapper} className={historyClassNames.listTimeTextWrapper}>
      <slots.listTimeText variant="body2" {...slotProps?.listTimeText}>
        {group?.label}
      </slots.listTimeText>
    </slots.listTimeTextWrapper>
  );
}

export default TimeGroupItem;
