import * as React from 'react';
import MessageCopyMenuItems from '../MessageCopyMenuItems';
import { ChatMessage } from '../../../../models/ChatMessage';
import { ChatDialogue } from '../../../../models/ChatDialogue';

type Props = {
  message: ChatMessage;
  dialogue: ChatDialogue;
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
