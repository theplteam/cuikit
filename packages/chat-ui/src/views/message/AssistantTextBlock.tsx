import * as React from 'react';
import { MessageModel } from '../../models';
import MessageMarkdownBlock from './markdown/MessageMarkdownBlock';
import { useObserverValue } from '../hooks/useObserverValue';
import { useChatSlots } from '../core/ChatSlotsContext';
import { MessageText } from '../../models/MessageText';

type Props = {
  messageText: MessageText;
  inProgress: boolean;
  message: MessageModel;
};

const AssistantTextBlock: React.FC<Props> = ({ messageText, message, inProgress }) => {
  const text = useObserverValue(messageText.observableText) ?? '';
  const { slots, slotProps } = useChatSlots();

  if (!text) return null;

  return (
    <MessageMarkdownBlock
      messageId={message.id}
      text={text}
      rootComponent={slots.markdownMessageRoot}
      rootComponentProps={slotProps.markdownMessageRoot}
      inProgress={inProgress}
    />
  );
}

export default AssistantTextBlock;
