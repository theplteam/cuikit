import * as React from 'react';
import MessageCopyMenuItems from '../MessageCopyMenuItems';
import { Message } from 'models/Message';
import { Dialogue } from 'models/Dialogue';

type Props = {
  message: Message;
  dialogue: Dialogue;
  onClose: () => void;
};

const MessageMobileAssistantActions: React.FC<Props> = ({ message, dialogue, onClose }) => {
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
