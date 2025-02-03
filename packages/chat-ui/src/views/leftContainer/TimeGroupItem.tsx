import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import { ListGroupType } from './useDialogueGroupedList';
import { materialTheme } from '../../utils/materialDesign/materialTheme';
import { materialDesignSysPalette } from '../../utils/materialDesign/palette';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { SlotFullPropItem } from '../../types/SlotFullPropItem';

type Props = {
  group?: ListGroupType;
  loading?: boolean;
} & SlotFullPropItem<'textComponent', TypographyProps>;

const SkeletonStyled = styled(Skeleton)(({ theme }) => ({
  ...materialTheme.title.small,
}));

const BoxStyled = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2, 1, 1.5),
  position: 'sticky',
  top: -12,
  left: 0,
  background: materialDesignSysPalette.surfaceContainerLow,
  zIndex: 1,
  [theme.breakpoints.down('md')]: {
    background: '#fff',
    top: 0,
  }
}));

const TimeGroupItem: React.FC<Props> = ({ group, loading, textComponent, textComponentProps }) => {
  const comp = { textComponent: textComponent ?? Typography };
  return (
    <BoxStyled>
      {loading
        ? (
          <SkeletonStyled variant={'text'} width={100} />
        )
        : (
          <comp.textComponent
            variant={'body2'}
            {...textComponentProps}
          >
            {group?.label}
          </comp.textComponent>
          )}
    </BoxStyled>
  );
}

export default TimeGroupItem;
