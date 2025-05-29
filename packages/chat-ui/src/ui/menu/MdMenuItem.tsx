import * as React from 'react';
import MenuItem, { type MenuItemProps } from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import ListItemIcon from '@mui/material/ListItemIcon';
import CircularProgress from '@mui/material/CircularProgress';

export type MdMenuItemProps = {
  children: string[] | string;
  startIcon?: React.ElementType;
  loading?: boolean;
} & Omit<MenuItemProps, 'children'>;

const MenuItemStyled = styled(MenuItem)(({ theme }) => ({
  minWidth: 180,
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1),
  minHeight: '48px !important',
  '& .MuiSvgIcon-root': {
    color: 'inherit',
    fontSize: '1.5rem',
  }
}));

const MdMenuItem: React.FC<MdMenuItemProps> = ({ children, startIcon, disabled, loading, ...otherProps }) => {
  const icon = startIcon ? React.createElement(startIcon, { fontSize: 'small' }) : undefined;
  return (
    <MenuItemStyled
      {...otherProps}
      disabled={disabled || loading}
    >
      {!!icon && (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
          {loading
            ? (
              <ListItemIcon>
                <CircularProgress size={24} />
              </ListItemIcon>
            )
            : (
              <ListItemIcon>
                {icon}
              </ListItemIcon>
            )}
        </>
      )}
      {children}
    </MenuItemStyled>
  );
}

export default MdMenuItem;
