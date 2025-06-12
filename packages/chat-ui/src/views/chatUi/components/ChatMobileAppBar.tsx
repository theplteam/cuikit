import * as React from 'react';
import { MenuIcon } from '../../../icons';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useMobile } from '../../../ui/Responsive';
import { useThreadListContext } from '../../core/threadList/ThreadListContext';

const ChatMobileAppBar: React.FC = () => {
  const { threadListModel } = useThreadListContext();
  const isMobile = useMobile();
  const handleClick = () => {
    threadListModel.menuDriverOpen.value = true;
  };

  if (!isMobile) return null;

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
        <IconButton onClick={handleClick}>
          <MenuIcon />
        </IconButton>
      </Box>
    </Stack>
  );
}

export default ChatMobileAppBar;
