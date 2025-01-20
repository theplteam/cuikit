import IconButton, { iconButtonClasses, type IconButtonProps } from '@mui/material/IconButton';
import * as React from 'react';
import { styled } from '@mui/material/styles';

type Props = {} & IconButtonProps;

const IconButtonStyled = styled(IconButton)(({ theme }) => ({
  fontSize: '1.5rem',
  color: theme.m3.sys.palette.onSurfaceVariant,

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
    color: theme.m3.sys.palette.primary,
  }
}));

const MdIconButton = React.forwardRef(({ onClick, ...props }: Props, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
  }

  return (
    <IconButtonStyled
      onClick={handleClick}
      {...props}
    />
  );
});

export { iconButtonClasses };
export default MdIconButton;
