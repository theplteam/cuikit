import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { LinearProgress } from '@mui/material';

type Props = {
  progress: number;
};

const BoxStyled = styled(Box)(() => ({
  width: '100%',
  pointerEvents: 'none',
}));

const LinearLoadProgress: React.FC<Props> = ({ progress }) => {
  return (
    <BoxStyled>
      <LinearProgress variant="determinate" value={progress} />
    </BoxStyled>
  );
};

export default LinearLoadProgress;
