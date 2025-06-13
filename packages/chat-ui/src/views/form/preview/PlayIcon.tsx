import * as React from 'react';
import { Avatar, styled } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const AvatarStyled = styled(Avatar)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  height: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.4)',
}));

const PlayIcon = () => (
  <AvatarStyled>
    <PlayArrowIcon color='action' sx={{ width: '80%', height: '80%' }} />
  </AvatarStyled>
);

export default PlayIcon;
