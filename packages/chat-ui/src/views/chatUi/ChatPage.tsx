// @ts-ignore
import * as React from 'react';
import ChatTheme from '../core/ChatTheme';
import ChatUi, { ChatUiProps } from './ChatUi';
import { Thread, Message } from '../../models';
import { ThreadListProps } from '../core/threadList/ThreadListType';
import { useChatApiRef } from '../hooks/useChatApiRef';
import ChatHistory from './components/ChatHistory';

type ChatPageProps<DM extends Message, DD extends Thread<DM>> = ChatUiProps<DM, DD> & { threadListProps?: ThreadListProps }

const ChatPage = <DM extends Message, DD extends Thread<DM>>(usersProps: ChatPageProps<DM, DD>) => {
  const { threadListProps, apiRef, loading, ...other } = usersProps;
  const chatApiRef = useChatApiRef();

  return (
    <ChatTheme>
      <ChatHistory apiRef={apiRef ?? chatApiRef} loading={!!loading} {...threadListProps} />
      <ChatUi {...other} apiRef={apiRef ?? chatApiRef} loading={loading} />
    </ChatTheme>
  );
};

export default ChatPage;
