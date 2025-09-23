import * as React from 'react';
import { useChatContext } from '../../core/ChatGlobalContext';
import { useChatCoreSlots } from '../../core/ChatSlotsContext';
import { ReplayIcon } from '../../../icons';
import { MessageModel, MessageUserContent } from '../../../models';

type Props = {
  message: MessageModel;
};

const MessageActionReload: React.FC<Props> = ({ message }) => {
  const { model, apiRef, onAssistantMessageTypingFinish } = useChatContext();

  const coreSlots = useChatCoreSlots();

  const handleClick = async () => {
    const thread = model.currentThread.value;
    const userMessage = thread?.messages.currentMessages.value.find(v => v.id === message.parentId);

    if (!userMessage || !thread) {
      console.error('reload error: user message not found', [message.parentId, model.currentThread.value?.messages.currentMessages.value.length]);
      return;
    }

    const content: MessageUserContent = userMessage.content;

    const newMessage = await apiRef.current?.onEditMessage(content, userMessage);
    if (newMessage) {
      onAssistantMessageTypingFinish?.({ message: userMessage.data, thread: thread.data });
    }
  }

  return (
    <coreSlots.iconButton
      size="small"
      onClick={handleClick}
    >
      <ReplayIcon />
    </coreSlots.iconButton>
  );
}

export default MessageActionReload;
