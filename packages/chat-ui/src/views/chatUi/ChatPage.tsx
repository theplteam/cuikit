// @ts-ignore
import * as React from 'react';
import ChatTheme from '../core/ChatTheme';
import ChatUi, { ChatUiProps } from './ChatUi';
import { Thread, Message } from '../../models';

const ChatPage = <DM extends Message, DD extends Thread<DM>>(usersProps: ChatUiProps<DM, DD>) => {
  return (
    <ChatTheme>
      <ChatUi {...usersProps} />
    </ChatTheme>
  );
}

export default ChatPage;
