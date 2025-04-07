import * as React from 'react';
import Stack from '@mui/material/Stack';
import MenuIcon from '@mui/icons-material/Menu';
import { useChatContext } from './../../core/ChatGlobalContext';
import { useChatSlots } from './../../core/ChatSlotsContext';
import { materialDesignSysPalette } from './../../../utils/materialDesign/palette';
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
      sx={{ backgroundColor: materialDesignSysPalette.surfaceContainerLow }}
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
