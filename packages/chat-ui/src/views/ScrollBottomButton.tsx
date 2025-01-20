import * as React from 'react';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import { styled } from '@mui/material/styles';
import MdIconButton from '../ui/MdIconButton';

type Props = {
  enabled: boolean;
  onClick: () => void;
};

const MdIconButtonStyled = styled(MdIconButton)(({ theme }) => ({
  position: 'absolute',
  top: -64,
  left: '50%',
  transition: theme.transitions.create(['opacity', 'box-shadow'], { duration: '200ms' }),
  transform: 'translateX(-50%)',
  zIndex: 1,
  background: theme.palette.background.paper,
  boxShadow: theme.m3.elevation.elevation6,
  '&:hover': {
    background: theme.palette.background.paper,
    boxShadow: theme.m3.elevation.elevation8,
  },
}));

const ScrollBottomButton: React.FC<Props> = ({ enabled, onClick }) => {
  return (
    <MdIconButtonStyled
      sx={{
        opacity: enabled ? 1 : 0,
      }}
      size={'small'}
      onClick={onClick}
    >
      <ArrowDropDown />
    </MdIconButtonStyled>
  );
}

export default ScrollBottomButton;
