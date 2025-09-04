import React from 'react';
import { styled, Avatar } from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';
import { materialDesignSysPalette } from '../../../utils/materialDesign/palette';

const AvatarStyled = styled(Avatar)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30%',
  height: '30%',
  minWidth: 40,
  minHeight: 40,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
}));

const PlayIcon: React.FC = () => (
  <AvatarStyled>
    <SvgIcon sx={{ width: '70%', height: '70%' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={materialDesignSysPalette.secondary}
      >
        <path fill="inherit" d="M8 5v14l11-7z" />
      </svg>
    </SvgIcon>
  </AvatarStyled>
);

export default PlayIcon;
