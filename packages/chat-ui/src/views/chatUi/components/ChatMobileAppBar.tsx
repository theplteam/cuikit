import * as React from 'react';
import { MenuIcon } from '../../../icons';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useThreadListContext } from '../../core/threadList/ThreadListContext';

const ChatMobileAppBar: React.FC = () => {
  const { apiRef, slots } = useThreadListContext();

  const handleClick = () => {
    apiRef.current?.setMenuDriverOpen(true);
  }

  return (
    <Stack
      width="100%"
      height={64}
      paddingX={1}
      justifyContent="center"
      sx={{
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    >
      <Box>
        <slots.baseIconButton onClick={handleClick}>
          <MenuIcon />
        </slots.baseIconButton>
      </Box>
    </Stack>
  );
}

export default ChatMobileAppBar;
