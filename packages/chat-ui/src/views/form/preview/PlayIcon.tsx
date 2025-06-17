import React from 'react';
import { styled, Avatar } from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';

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
    <SvgIcon sx={{ width: '80%', height: '80%' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="inherit"
      >
        <path fill="inherit" d="M8 5v14l11-7z" />
      </svg>
    </SvgIcon>
  </AvatarStyled>
);

export default PlayIcon;
