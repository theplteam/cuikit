import * as React from 'react';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { MdText } from '../../../ui/TextUi';

type Props = {} & TableCellProps;

const BoxStyled = styled(Box)(({ theme }) => ({
  minWidth: 100,
  /*height: 40,
  maxHeight: 40,*/
  overflowY: 'hidden',
  whiteSpace: 'nowrap',
}));

const ChatMessageTableCell: React.FC<Props> = ({ children, ...otherProps }) => {
  return (
    <TableCell {...otherProps} size={'small'}>
      <BoxStyled>
        <MdText>{children}</MdText>
      </BoxStyled>
    </TableCell>
  );
}

export default ChatMessageTableCell;
