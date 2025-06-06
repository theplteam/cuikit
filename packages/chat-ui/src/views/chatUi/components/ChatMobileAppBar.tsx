import * as React from 'react';
import Stack from '@mui/material/Stack';
import { MenuIcon } from '../../../icons';
import { useChatContext } from './../../core/ChatGlobalContext';
import { useChatSlots } from './../../core/ChatSlotsContext';
import { Box } from '@mui/material';

const ChatMobileAppBar: React.FC = () => {
  const { apiRef } = useChatContext();
  const { coreSlots } = useChatSlots();

  const handleClick = () => {
    apiRef.current?.setMenuDriverOpen(true);
  }

  return (
    <Stack
      justifyContent="center"
      height={64}
      paddingX={1}
    >
      <Box>
        <coreSlots.iconButton onClick={handleClick}>
          <MenuIcon />
        </coreSlots.iconButton>
      </Box>
    </Stack>
  );
}

export default ChatMobileAppBar;
