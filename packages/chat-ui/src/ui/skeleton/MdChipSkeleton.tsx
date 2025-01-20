import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

type Props = {
  width?: number;
};

const MdChipSkeleton: React.FC<Props> = ({ width }) => {
  return (
    <Box width={width ?? 180} height={32}>
      <Skeleton variant="rounded" height={32} />
    </Box>
  );
}

export default MdChipSkeleton;
