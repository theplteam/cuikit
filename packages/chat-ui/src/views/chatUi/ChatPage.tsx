// @ts-ignore
import * as React from 'react';
import ChatTheme from '../core/ChatTheme';
import ChatUi, { ChatUiProps } from './ChatUi';
import { Thread, Message } from '../../models';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

const ChatPage = <DM extends Message, DD extends Thread<DM>>(usersProps: ChatUiProps<DM, DD>) => {
  const emotionCache = createCache({ key: 'css', prepend: true });
  emotionCache.compat = true;

  return (
    <CacheProvider value={emotionCache}>
      <ChatTheme>
        <ChatUi {...usersProps} />
      </ChatTheme>
    </CacheProvider>
  );
}

export default ChatPage;
