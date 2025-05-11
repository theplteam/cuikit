import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';

type Props = {
  progress: number;
  size?: number;
};

const BoxStyled = styled(Box)(() => ({
  position: 'absolute',
  height: '100%',
  width: '100%',
  pointerEvents: 'none',
  backgroundColor: 'transparent',
}));

const CircularLoadProgress: React.FC<Props> = ({ progress, size }) => {
  return (
    <BoxStyled>
      <CircularProgress variant="determinate" value={progress} size={size || 60} />
    </BoxStyled>
  );
};

export default CircularLoadProgress;
