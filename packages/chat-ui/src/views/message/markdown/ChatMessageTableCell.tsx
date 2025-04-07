import * as React from 'react';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { SlotFullPropItem } from '../../../types/SlotFullPropItem';

type Props = SlotFullPropItem<'textComponent', TypographyProps> & TableCellProps;

const BoxStyled = styled(Box)(() => ({
  minWidth: 100,
  /*height: 40,
  maxHeight: 40,*/
  overflowY: 'hidden',
  whiteSpace: 'nowrap',
}));

const ChatMessageTableCell: React.FC<Props> = ({ children, textComponent, textComponentProps, ...otherProps }) => {
  const comp = { textComponent: textComponent ?? Typography, textComponentProps };
  return (
    <TableCell size="small" {...otherProps}>
      <BoxStyled>
        <comp.textComponent {...comp.textComponentProps}>
          {children}
        </comp.textComponent>
      </BoxStyled>
    </TableCell>
  );
}

export default ChatMessageTableCell;
