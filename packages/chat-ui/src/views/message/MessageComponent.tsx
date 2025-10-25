import * as React from 'react';
import MessageUser from './MessageUser';
import MessageAssistant from './MessageAssistant';
import { MessageModel } from '../../models/MessageModel';
import { ThreadModel } from '../../models/ThreadModel';
import MessageComponentBox from './MessageComponentBox';

type Props = {
  message: MessageModel;
  thread: ThreadModel;
  enableAssistantActions?: boolean;
  style?: React.CSSProperties;
  elevation?: boolean;
};

const MessageComponent: React.FC<Props> = ({ style, elevation, message, enableAssistantActions, thread }) => {
  return (
    <MessageComponentBox
      isUser={message.isUser}
      style={style}
    >
      {message.isUser
        ? (
          <MessageUser
            message={message}
            thread={thread}
            elevation={elevation}
          />
        ) : (
          <MessageAssistant
            message={message}
            enableAssistantActions={enableAssistantActions}
            thread={thread}
            elevation={elevation}
          />
        )}
    </MessageComponentBox>
  );
};

export default React.memo(MessageComponent);
