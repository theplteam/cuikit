// @ts-ignore
import * as React from 'react';
import { ThreadListProps } from '../../core/threadList/ThreadListType';
import { ApiRefType } from '../../core/useApiRef';
import { ThreadListProvider } from '../../core/threadList/ThreadListContext';
import { useThreadListInit } from './useThreadListInit';

type ChatHistoryProps = {
  loading: boolean;
  apiRef: React.MutableRefObject<ApiRefType | null>;
} & Partial<ThreadListProps>;

const ChatHistory: React.FC<ChatHistoryProps> = (props) => {
  const { apiRef, loading, ...other } = props;
  const threadListData = useThreadListInit(apiRef, loading, other);

  return (
    <ThreadListProvider {...threadListData}>
      <div>
        {"123"}
      </div>
    </ThreadListProvider>
  );
};

export default ChatHistory;
