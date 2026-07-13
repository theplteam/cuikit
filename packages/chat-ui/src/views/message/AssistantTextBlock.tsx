import * as React from 'react';
import { MessageModel } from '../../models';
import MessageMarkdownBlock from './markdown/MessageMarkdownBlock';
import { useObserverValue } from '../hooks/useObserverValue';
import { useChatSlots } from '../core/ChatSlotsContext';
import Stack from '@mui/material/Stack';
import { MessageText } from '../../models/MessageText';

type Props = {
  messageText: MessageText;
  showStatus: boolean;
  inProgress: boolean;
  message: MessageModel;
};

const AssistantTextBlock: React.FC<Props> = ({ messageText, message, showStatus, inProgress }) => {
  const text = useObserverValue(messageText.observableText) ?? '';
  const { slots, slotProps } = useChatSlots();

  return (
    <Stack gap={1}>
      {!!showStatus && (
        <slots.messageAssistantStatus
          {...slotProps.messageAssistantStatus}
          message={message}
        />
      )}
      {!!text && (
        <MessageMarkdownBlock
          text={text}
          messageId={message.id}
          rootComponent={slots.markdownMessageRoot}
          rootComponentProps={slotProps.markdownMessageRoot}
          inProgress={inProgress}
        />
      )}
    </Stack>

  );
}

export default AssistantTextBlock;
