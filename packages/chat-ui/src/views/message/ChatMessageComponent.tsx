import * as React from 'react';
import ChatMessageUser from './ChatMessageUser';
import ChatMessageAssistant from './ChatMessageAssistant';
import { ChatViewConstants } from '../ChatViewConstants';
import Box from '@mui/material/Box';
import { MessageModel } from '../../models/MessageModel';
import { ThreadModel } from '../../models/ThreadModel';

type Props = {
  message: MessageModel;
  thread: ThreadModel;
  isLatest?: boolean;
  isFirst?: boolean;
  enableAssistantActions?: boolean;
  style?: React.CSSProperties;
  disableActions?: boolean;
  elevation?: boolean;
};

const ChatMessageComponent: React.FC<Props> = ({style, elevation, disableActions, message, isLatest, isFirst, enableAssistantActions, thread}) => {
  return (
    <Box
      justifyContent={message.isUser ? 'flex-end' : 'flex-start'}
      {...{
        [ChatViewConstants.MESSAGE_DATA_SCROLL_ANCHOR]: isLatest,
      }}
      display={'flex'}
      width={'100%'}
      boxSizing={'border-box'}
      style={style}
    >
      {message.isUser
        ? (
          <ChatMessageUser
            message={message}
            dialogue={thread}
            isFirst={isFirst}
            elevation={elevation}
            disableActions={disableActions}
          />
        )
        : (
          <ChatMessageAssistant
            isLatest={isLatest}
            message={message}
            enableAssistantActions={enableAssistantActions}
            thread={thread}
            elevation={elevation}
          />
        )}
    </Box>
  );
};

export default ChatMessageComponent;
