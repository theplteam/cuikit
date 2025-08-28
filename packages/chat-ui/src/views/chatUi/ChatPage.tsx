import * as React from 'react';
import ChatTheme, { ThemeProps } from '../core/ChatTheme';
import { Thread, Message } from '../../models';
import { HistoryProps } from '../core/history/HistoryType';
import { useChatApiRef } from '../hooks/useChatApiRef';
import History from '../leftContainer/History';
import { useElementRef } from './../hooks/useElementRef';
import Chat from '../Chat';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { ChatUsersProps } from '../core/useChatProps';
import ChatMobileAppBar from './components/ChatMobileAppBar';

type ChatPageProps<DM extends Message, DD extends Thread<DM>> = ChatUsersProps<DM, DD> & { historyProps?: HistoryProps, className?: string, themeProps: Omit<ThemeProps, 'children'> };

const ChatPage = <DM extends Message, DD extends Thread<DM>>(usersProps: ChatPageProps<DM, DD>) => {
  const { historyProps, apiRef, loading, lang, className, themeProps, ...chatProps } = usersProps;
  const chatApiRef = useChatApiRef();
  const ref = useElementRef();
  const userApiRef = apiRef ?? chatApiRef;

  return (
    <ChatTheme {...themeProps}>
      <Stack
        flexDirection={{ xs: 'column', sm: 'row' }}
        height="inherit"
        width="inherit"
        position="relative"
        className={className}
        sx={{
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        <History
          apiRef={userApiRef}
          loading={loading}
          lang={lang}
          {...historyProps}
        />
        <ChatMobileAppBar apiRef={userApiRef} />
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
            apiRef={userApiRef}
            loading={loading}
            lang={lang}
            {...chatProps}
          />
        </Box>
      </Stack>
    </ChatTheme>
  );
};

export default ChatPage;
