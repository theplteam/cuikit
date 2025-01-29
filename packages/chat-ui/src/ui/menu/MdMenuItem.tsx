import * as React from 'react';
import MenuItem, { MenuItemProps, menuItemClasses } from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import ListItemIcon from '@mui/material/ListItemIcon';
import SvgIcon from '@mui/material/SvgIcon';
import CircularProgress from '@mui/material/CircularProgress';
import { translateStringNode } from '../TextUi';
import { materialTheme } from '../../utils/materialDesign/materialTheme';
import { materialDesignSysPalette } from '../../utils/materialDesign/palette';

type Props = {
  children: string[] | string;
  startIcon?: typeof SvgIcon;
  loading?: boolean;
} & Omit<MenuItemProps, 'children'>;

const MenuItemStyled = styled(MenuItem)(({ theme }) => ({
  minWidth: 180,
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1),
  minHeight: '48px !important',
  [`& .${menuItemClasses.root}`]: {
    ...materialTheme.label.large,
    color: materialDesignSysPalette.surfaceVariant,
  },
  '& .MuiSvgIcon-root': {
    color: materialDesignSysPalette.onSurfaceVariant,
    fontSize: '1.5rem',
  }
}));

const MdMenuItem: React.FC<Props> = ({ children, startIcon, disabled, loading, ...otherProps }) => {
  const icon = startIcon ? React.createElement(startIcon, { fontSize: 'small' }) : undefined;
  return (
    <MenuItemStyled
      {...otherProps}
      disabled={disabled || loading}
    >
      {!!icon && (
        <>
          {loading
            ? <ListItemIcon><CircularProgress size={24}/></ListItemIcon>
            : <ListItemIcon>{icon}</ListItemIcon>}
        </>
      )}
      {translateStringNode(children)}
    </MenuItemStyled>
  );
}

export default MdMenuItem;
