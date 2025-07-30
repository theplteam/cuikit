import * as React from 'react';
import { MessageModel, ThreadModel } from '../../models';
import { arrayPluckAndJoin } from '../../utils/arrayUtils/arrayPluckAndJoin';
import ChatMessageComponent from './MessageComponent';
import Stack from '@mui/material/Stack';
import { useChatContext } from '../core/ChatGlobalContext';

type Props = {
  messages: MessageModel[];
  isLatestGroup: boolean;
  thread: ThreadModel;
  gap: number;
};

const MessagesInGroup: React.FC<Props> = ({ messages, thread, isLatestGroup, gap }) => {
  const { apiRef } = useChatContext();

  const minHeight = React.useMemo(() => {
    if (isLatestGroup) {
      return apiRef.current?.getConversationBlockHeight();
    }

    return undefined;
  }, [isLatestGroup]);

  return (
    <Stack
      gap={gap}
      minHeight={minHeight}
      alignItems="flex-start"
      maxWidth="100%"
      width="100%"
    >
      {messages.map((message) => (
        <ChatMessageComponent
          key={message.viewerUniqueKey}
          enableAssistantActions
          message={message}
          thread={thread}
          showStatus={isLatestGroup}
        />
      ))}
    </Stack>
  );
}

export default React.memo(MessagesInGroup, (prevProps, nextProps) => {
  return prevProps.isLatestGroup === nextProps.isLatestGroup
    && arrayPluckAndJoin(prevProps.messages, 'id') === arrayPluckAndJoin(nextProps.messages, 'id');
});
