import * as React from 'react';
import { MessageModel, ThreadModel } from '../../models';
import { arrayPluckAndJoin } from '../../utils/arrayUtils/arrayPluckAndJoin';
import ChatMessageComponent from './ChatMessageComponent';
import Stack from '@mui/material/Stack';
import { useChatContext } from '../core/ChatGlobalContext';

type Props = {
  messages: MessageModel[];
  isLatestGroup: boolean;
  thread: ThreadModel;
  gap: number;
};

const MessagesInGroup: React.FC<Props> = ({ messages, isLatestGroup, thread, gap }) => {
  const { apiRef } = useChatContext();

  const messagesLength = messages.length;

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
      {messages.map((message, key) => (
        <ChatMessageComponent
          key={message.viewerUniqueKey}
          enableAssistantActions
          message={message}
          thread={thread}
          isFirst={!key}
          isLatest={isLatestGroup ? key === messagesLength -1 : undefined}
        />
      ))}
    </Stack>
  );
}

export default React.memo(MessagesInGroup, (prevProps, nextProps) => {
  return prevProps.isLatestGroup === nextProps.isLatestGroup
    && arrayPluckAndJoin(prevProps.messages, 'id') === arrayPluckAndJoin(nextProps.messages, 'id');
});
