import * as React from 'react';
import ChatTheme from '../core/ChatTheme';
import ChatUi, { ChatUiProps } from './ChatUi';
import { DDialogue, DMessage } from '../../models';

const ChatPage = <DM extends DMessage, DD extends DDialogue<DM>>(usersProps: ChatUiProps<DM, DD>) => {
  return (
    <ChatTheme>
      <ChatUi {...usersProps} />
    </ChatTheme>
  );
}

export default ChatPage;
