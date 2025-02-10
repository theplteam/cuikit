import * as React from 'react';
import MessageCopyMenuItems from '../MessageCopyMenuItems';
import { MessageLight } from '../../../../models/Message';
import { DialogueLight } from '../../../../models/Dialogue';

type Props = {
  message: MessageLight;
  dialogue: DialogueLight;
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
