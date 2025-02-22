import * as React from 'react';
import MessageCopyMenuItems from '../MessageCopyMenuItems';
import { MessageModel } from '../../../../models/MessageModel';
import { ThreadModel } from '../../../../models/ThreadModel';

type Props = {
  message: MessageModel;
  thread: ThreadModel;
  onClose: () => void;
};

const MessageMobileAssistantActions: React.FC<Props> = ({ message, onClose }) => {
  return (
    <>
      <MessageCopyMenuItems
        text={message.text}
        handleClose={onClose}
      />
    </>
  );
}

export default MessageMobileAssistantActions;
