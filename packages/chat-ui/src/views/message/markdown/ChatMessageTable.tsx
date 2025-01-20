import * as React from 'react';
import Table, { TableProps } from '@mui/material/Table';
import Box from '@mui/material/Box';

const ChatMessageTable: React.FC<TableProps> = (props) => {
  return (
    <Box
      sx={{
        overflowX: 'auto',
        marginTop: 1,
      }}
    >
      <Table {...props} />
    </Box>
  );
};

export default ChatMessageTable;
