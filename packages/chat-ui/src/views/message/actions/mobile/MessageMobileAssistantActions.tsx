import * as React from 'react';
import MessageCopyMenuItems from '../MessageCopyMenuItems';
import { MessageModel } from '../../../../models/MessageModel';

type Props = {
  message: MessageModel;
  onClose: () => void;
};

const MessageMobileAssistantActions: React.FC<Props> = ({ message, onClose }) => {
  return (
    <MessageCopyMenuItems
      text={message.text}
      handleClose={onClose}
    />
  );
}

export default MessageMobileAssistantActions;
