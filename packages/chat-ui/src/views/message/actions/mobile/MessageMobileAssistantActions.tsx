import * as React from 'react';
import MessageCopyMenuItems from '../MessageCopyMenuItems';
import { Message } from '../../../../models/Message';
import { DialogueAbstract } from '../../../../models/DialogueAbstract';

type Props = {
  message: Message;
  dialogue: DialogueAbstract;
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
