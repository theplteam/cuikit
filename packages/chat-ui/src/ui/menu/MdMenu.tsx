import * as React from 'react';
import Menu, { MenuProps, menuClasses } from '@mui/material/Menu';
import { styled } from '@mui/material/styles';

type Props = {} & MenuProps;

const MenuStyled = styled(Menu)(({ theme }) => ({
  [`& .${menuClasses.list}`]: {
    padding: theme.spacing(0.5, 0)
  }
}));

const MdMenu: React.FC<Props> = (props) => {
  return (
    <MenuStyled {...props} />
  );
}

export default MdMenu;
