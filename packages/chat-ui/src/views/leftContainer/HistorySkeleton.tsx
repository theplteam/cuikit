import * as React from 'react';
import Stack from '@mui/material/Stack';
import TimeGroupItem from './TimeGroupItem';
import MdListItemSkeleton from '../../ui/skeleton/MdListItemSkeleton';

const HistorySkeleton: React.FC = () => {
  return (
    <Stack width="100%">
      <TimeGroupItem loading />
      <MdListItemSkeleton width={250} />
      <MdListItemSkeleton width={250} />
      <MdListItemSkeleton width={250} />
    </Stack>
  );
}

export default HistorySkeleton;
