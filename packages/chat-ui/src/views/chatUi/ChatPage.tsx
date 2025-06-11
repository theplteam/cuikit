// @ts-ignore
import * as React from 'react';
import ChatTheme from '../core/ChatTheme';
import ChatUi, { ChatUiProps } from './ChatUi';
import { Thread, Message } from '../../models';
import { ThreadListProvider } from '../core/threadList/ThreadListContext';
import { useThreadListInit } from './components/useThreadListInit';
import { ThreadListProps } from '../core/threadList/ThreadListType';
import { useChatApiRef } from '../hooks/useChatApiRef';

type ChatPageProps<DM extends Message, DD extends Thread<DM>> = ChatUiProps<DM, DD> & { threadListProps?: ThreadListProps }

const ChatPage = <DM extends Message, DD extends Thread<DM>>(usersProps: ChatPageProps<DM, DD>) => {
  const { threadListProps, apiRef, loading, ...other } = usersProps;
  const chatApiRef = useChatApiRef();
  const threadListData = useThreadListInit(apiRef ?? chatApiRef, loading, threadListProps);

  return (
    <ChatTheme>
      <ThreadListProvider {...threadListData}>
        <ChatUi {...other} apiRef={apiRef ?? chatApiRef} loading={loading} />
      </ThreadListProvider>
    </ChatTheme>
  );
};

export default ChatPage;
