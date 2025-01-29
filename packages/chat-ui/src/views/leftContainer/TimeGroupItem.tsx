import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import { ListGroupType } from './useDialogueGroupedList';
import { MdTextUi } from '../../ui/TextUi';
import { materialTheme } from '../../utils/materialDesign/materialTheme';
import { materialDesignSysPalette } from '../../utils/materialDesign/palette';

type Props = {
  group?: ListGroupType;
  loading?: boolean;
};

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

const TimeGroupItem: React.FC<Props> = ({ group, loading }) => {
  return (
    <BoxStyled>
      {loading
        ? (
          <SkeletonStyled variant={'text'} width={100} />
        )
        : (
          <MdTextUi
            m3typography={'title.small'}
          >
            {group?.label}
          </MdTextUi>
          )}
    </BoxStyled>
  );
}

export default TimeGroupItem;
