import * as React from 'react';
import { MessageModel } from '../../models';
import MessageMarkdownBlock from './markdown/MessageMarkdownBlock';
import { useObserverValue } from '../hooks/useObserverValue';
import { useChatSlots } from '../core/ChatSlotsContext';
import Stack from '@mui/material/Stack';
import { MessageText } from '../../models/MessageText';

type Props = {
  messageText: MessageText;
  inProgress: boolean;
  message: MessageModel;
  showStatus: boolean;
};

const AssistantTextBlock: React.FC<Props> = ({ messageText, message, inProgress, showStatus }) => {
  const text = useObserverValue(messageText.observableText) ?? '';
  const { slots, slotProps } = useChatSlots();

  if (!text) return null;

  return (
    <Stack gap={1}>
      {!!showStatus && (
        <slots.messageAssistantProgress
          {...slotProps.messageAssistantProgress}
          message={message}
        />
      )}
      <MessageMarkdownBlock
        text={text}
        rootComponent={slots.markdownMessageRoot}
        rootComponentProps={slotProps.markdownMessageRoot}
        inProgress={inProgress}
        messageId={message.id}
      />
    </Stack>
  );
}

export default AssistantTextBlock;
