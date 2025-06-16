// @ts-ignore
import * as React from 'react';
import ChatTheme from '../core/ChatTheme';
import { Thread, Message } from '../../models';
import { ThreadListProps } from '../core/threadList/ThreadListType';
import { useChatApiRef } from '../hooks/useChatApiRef';
import ChatHistory from './components/ChatHistory';
import { useElementRef } from './../hooks/useElementRef';
import Chat from '../Chat';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { ChatUsersProps } from '../core/useChatProps';
import ChatMobileAppBar from './components/ChatMobileAppBar';

type ChatPageProps<DM extends Message, DD extends Thread<DM>> = ChatUsersProps<DM, DD> & { threadListProps?: ThreadListProps };

const ChatPage = <DM extends Message, DD extends Thread<DM>>(usersProps: ChatPageProps<DM, DD>) => {
  const { threadListProps, apiRef, loading, lang, ...chatProps } = usersProps;
  const chatApiRef = useChatApiRef();
  const ref = useElementRef();

  const userApiRef = apiRef ?? chatApiRef;

  return (
    <ChatTheme>
      <Stack
        flexDirection={{ xs: 'column', sm: 'row' }}
        height="inherit"
        width="inherit"
        position="relative"
      >
        <ChatHistory
          apiRef={userApiRef}
          loading={!!loading}
          lang={lang}
          {...threadListProps}
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
