import * as React from 'react';
import ListItemButton, { ListItemButtonProps, listItemButtonClasses } from '@mui/material/ListItemButton';
import { styled } from '@mui/material/styles';
import hexToRgba from 'hex-to-rgba';

type Props = ListItemButtonProps;

const ListItemButtonStyled = styled(ListItemButton)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  minHeight: 56,
  boxSizing: 'border-box',
  [`&.${listItemButtonClasses.selected}`]: {
    backgroundColor: hexToRgba(theme.m3.sys.palette.primary, 0.08),
  },
}));

const MdListItemButton: React.FC<Props> = (props) => {
  return (
    <ListItemButtonStyled {...props} />
  );
}

export default MdListItemButton;
