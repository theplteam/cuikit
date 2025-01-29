import IconButton, { iconButtonClasses, type IconButtonProps } from '@mui/material/IconButton';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { materialDesignSysPalette } from '../utils/materialDesign/palette';

export type MdIconButtonProps = {} & IconButtonProps;

const IconButtonStyled = styled(IconButton)(({ theme }) => ({
  fontSize: '1.5rem',
  color: materialDesignSysPalette.onSurfaceVariant,

  [`&.${iconButtonClasses.root}`]: {
    padding: theme.spacing(1.5),
  },

  [`&.${iconButtonClasses.sizeSmall}`]: {
    padding: '8px',
  },
  '& .MuiSvgIcon-root': {
    fontSize: 'inherit',
    color: 'inherit',
  },
  [`&.${iconButtonClasses.colorPrimary}`]: {
    color: materialDesignSysPalette.primary,
  }
}));

const MdIconButton = React.forwardRef<HTMLButtonElement | null, MdIconButtonProps>(({ onClick, ...props }, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
  }

  return (
    <IconButtonStyled
      onClick={handleClick}
      {...props}
      ref={ref}
    />
  );
});

export { iconButtonClasses };
export default MdIconButton;
