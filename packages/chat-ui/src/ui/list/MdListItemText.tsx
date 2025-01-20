import * as React from 'react';
import ListItemText, { ListItemTextProps, listItemTextClasses } from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import { translateStringNode } from '../TextUi';

type Props = ListItemTextProps;

const ListItemTextStyled = styled(ListItemText)(({ theme }) => ({
  [`&.${listItemTextClasses.root}`]: {
    marginTop: 0,
    marginBottom: 0,
  },
  [`& .${listItemTextClasses.primary}`]: {
    ...theme.m3.materialTheme.body.large,
    color: theme.m3.sys.palette.onSurface,
  },
}));

const MdListItemText: React.FC<Props> = (props) => {
  return (
    <ListItemTextStyled
      {...props}
      primary={translateStringNode(props.primary)}
      secondary={translateStringNode(props.secondary)}
    />
  );
}

export default MdListItemText;
