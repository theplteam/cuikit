import * as React from 'react';
import Stack from '@mui/material/Stack';
import TimeGroupItem from './TimeGroupItem';
import MdListItemSkeleton from '../../ui/skeleton/MdListItemSkeleton';

type Props = {};

const ChatHistorySkeleton: React.FC<Props> = () => {
  return (
    <Stack width={'100%'}>
      <TimeGroupItem loading />
      <MdListItemSkeleton width={250} />
      <MdListItemSkeleton width={250} />
      <MdListItemSkeleton width={250} />
    </Stack>
  );
}

export default ChatHistorySkeleton;
