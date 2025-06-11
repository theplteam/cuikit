import * as React from 'react';
import Stack from '@mui/material/Stack';
import Chat from './../Chat';
import { useElementRef } from './../hooks/useElementRef';
import { ChatUsersProps } from './../core/useChatProps';
import { useMobile, useTablet } from './../../ui/Responsive';
import { Thread, Message } from './../../models';
import ThreadsList from '../leftContainer/ThreadsList';
import ChatMobileAppBar from './components/ChatMobileAppBar';
import Box from '@mui/material/Box';

export type ChatUiProps<DM extends Message, DD extends Thread<DM>> = React.PropsWithChildren<{
  listPlacement?: 'left' | 'right';
}> & ChatUsersProps<DM, DD>;

const ChatUi = <DM extends Message, DD extends Thread<DM>>(usersProps: ChatUiProps<DM, DD>) => {
  const { slots, listPlacement = 'left', ...other } = usersProps;

  const ref = useElementRef();
  const isMobile = useMobile();
  const isTablet = useTablet();

  const listContainerComponent = React.useMemo(() => !isMobile ? (
    <Box
      width="100%"
      height="100%"
      sx={{
        maxWidth: isTablet ? 220 : 360,
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    >
      <ThreadsList />
    </Box>
  ) : null, [isMobile, isTablet]);

  return (
    <Stack
      flexDirection={{ xs: 'column', sm: 'row' }}
      height="inherit"
      width="inherit"
      position="relative"
    >
      {listPlacement === 'left' && listContainerComponent}
      {isMobile ? <ChatMobileAppBar /> : null}
      <Box
        ref={ref}
        flex={1}
        height="100%"
        width="100%"
        overflow="auto"
        position="relative"
      >
        <Chat
          scrollerRef={ref}
          {...other}
        />
      </Box>
      {listPlacement === 'right' && listContainerComponent}
    </Stack>
  )
}

export default ChatUi;
