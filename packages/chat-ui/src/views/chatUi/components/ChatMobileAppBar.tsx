import * as React from 'react';
import Stack from '@mui/material/Stack';
import MenuIcon from '@mui/icons-material/Menu';
import { useChatContext } from './../../core/ChatGlobalContext';
import { useChatSlots } from './../../core/ChatSlotsContext';
import { materialDesignSysPalette } from './../../../utils/materialDesign/palette';
import { Box } from '@mui/material';

const ChatMobileAppBar: React.FC = () => {
  const { model } = useChatContext();
  const { coreSlots } = useChatSlots();

  const handleClick = () => {
    model.actions.menuDriverOpen.value = true
  }

  return (
    <Stack
      justifyItems={'center'}
      justifyContent={'center'}
      height={64}
      borderTop={`1px solid ${materialDesignSysPalette.outline}`}
      sx={{ backgroundColor: materialDesignSysPalette.surfaceContainerLow }}
    >
      <Box display={'flex'} justifyItems={'center'} justifyContent={'center'}>
        <coreSlots.iconButton onClick={handleClick}>
          <MenuIcon />
        </coreSlots.iconButton>
      </Box>
    </Stack>
  );
}

export default ChatMobileAppBar;
