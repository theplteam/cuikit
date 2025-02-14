import * as React from 'react';
import { styled } from '@mui/material/styles';
import Skeleton, { SkeletonProps } from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { materialTheme } from '../../utils/materialDesign/materialTheme';

type Props = SkeletonProps;

const ListItemSkeletonStyled = styled(Skeleton)(() => ({
  ...materialTheme.body.large,
}));

const BoxStyled = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 1.5),
  boxSizing: 'border-box',
  height: 56,
  display: 'flex',
  alignItems: 'center',
}));

const MdListItemSkeleton: React.FC<Props> = (props) => {
  return (
    <BoxStyled>
      <ListItemSkeletonStyled {...props} />
    </BoxStyled>
  );
}

export default MdListItemSkeleton;
