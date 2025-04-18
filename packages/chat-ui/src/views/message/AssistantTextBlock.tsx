import * as React from 'react';
import { MessageModel, ThreadModel } from '../../models';
import ChatMarkdownBlock from './markdown/ChatMarkdownBlock';
import { useObserverValue } from '../hooks/useObserverValue';
import { useChatSlots } from '../core/ChatSlotsContext';
import Stack from '@mui/material/Stack';
import { MessageText } from '../../models/MessageText';

type Props = {
  messageText: MessageText;
  showStatus: boolean;
  message: MessageModel;
  thread: ThreadModel;
};

const AssistantTextBlock: React.FC<Props> = ({ messageText, message, showStatus, thread }) => {
  const text = useObserverValue(messageText.observableText) ?? '';
  const { slots, slotProps } = useChatSlots();
  return (
    <Stack gap={1}>
      {!!showStatus && (
        <slots.messageAssistantProgress
          {...slotProps.messageAssistantProgress}
          message={message}
          thread={thread}
        />
      )}
      {!!text && (
        <ChatMarkdownBlock
          text={text}
          rootComponent={slots.markdownMessageRoot}
          rootComponentProps={slotProps.markdownMessageRoot}
        />
      )}
    </Stack>

  );
}

export default AssistantTextBlock;
