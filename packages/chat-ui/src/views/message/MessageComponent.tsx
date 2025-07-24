import * as React from 'react';
import MessageUser from './MessageUser';
import MessageAssistant from './MessageAssistant';
import { ChatViewConstants } from '../ChatViewConstants';
import { MessageModel } from '../../models/MessageModel';
import { ThreadModel } from '../../models/ThreadModel';
import MessageComponentBox from './MessageComponentBox';

type Props = {
  message: MessageModel;
  thread: ThreadModel;
  isLatest?: boolean;
  isFirst?: boolean;
  enableAssistantActions?: boolean;
  style?: React.CSSProperties;
  elevation?: boolean;
  forceStream?: boolean;
};

const MessageComponent: React.FC<Props> = ({ style, elevation, message, isLatest, isFirst, enableAssistantActions, thread, forceStream }) => {
  return (
    <MessageComponentBox
      isUser={message.isUser}
      {...{
        [ChatViewConstants.MESSAGE_DATA_SCROLL_ANCHOR]: isLatest,
      }}
      style={style}
    >
      {message.isUser
        ? (
          <MessageUser
            message={message}
            thread={thread}
            isFirst={isFirst}
            elevation={elevation}
          />
        )
        : (
          <MessageAssistant
            isLatest={isLatest}
            message={message}
            enableAssistantActions={enableAssistantActions}
            thread={thread}
            elevation={elevation}
            forceStream={forceStream}
          />
        )}
    </MessageComponentBox>
  );
};

export default React.memo(MessageComponent);
