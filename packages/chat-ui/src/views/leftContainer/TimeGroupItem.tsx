import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import { ListGroupType } from './useThreadsGroupedList';
import { useThreadListContext } from '../core/threadList/ThreadListContext';

type Props = {
  group?: ListGroupType;
  loading?: boolean;
};

const BoxStyled = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2, 1, 1.5),
  position: 'sticky',
  top: -12,
  left: 0,
  background: theme.palette.grey[300],
  zIndex: 1,
  [theme.breakpoints.down('md')]: {
    background: '#fff',
    top: 0,
  }
}));

const TimeGroupItem: React.FC<Props> = ({ group, loading }) => {
  const { slots, slotProps } = useThreadListContext();

  return (
    <BoxStyled>
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
    </BoxStyled>
  );
}

export default TimeGroupItem;
