import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { ListGroupType } from './useThreadsGroupedList';
import { useHistoryContext } from '../core/history/HistoryContext';
import { historyClassNames } from '../core/history/historyClassNames';
import clsx from 'clsx';

type Props = {
  group?: ListGroupType;
  loading?: boolean;
};

const TimeGroupItem: React.FC<Props> = ({ group, loading }) => {
  const { slots, slotProps } = useHistoryContext();

  return (
    <slots.listTimeTextWrapper
      {...slotProps.listTimeTextWrapper}
      className={clsx(historyClassNames.historyListTimeTextWrapper, slotProps.listTimeTextWrapper?.className)}
    >
      {loading
        ? (
          <Skeleton variant="text" width={100} />
        )
        : (
          <slots.listTimeText
            variant="body2"
            {...slotProps.listTimeText}
          >
            {group?.label}
          </slots.listTimeText>
        )}
    </slots.listTimeTextWrapper>
  );
}

export default TimeGroupItem;
