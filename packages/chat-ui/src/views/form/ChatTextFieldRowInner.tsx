import * as React from 'react';
import { styled } from '@mui/material/styles';
import ChatTextField from './ChatTextField';
import Stack from '@mui/material/Stack';
import SendMessageButton from './SendMessageButton';
import { inputBaseClasses } from '@mui/material/InputBase';
import { useObserverValue } from '../hooks/useObserverValue';
import { ThreadModel } from '../../models/ThreadModel';
import { materialDesignSysPalette } from '../../utils/materialDesign/palette';
import { motion } from '../../utils/materialDesign/motion';
import FileAttachmentButton from './FileAttachmentButton';
import { useChatContext } from '../core/ChatGlobalContext';
import { ChatMessageContentType, Message } from '../../models';
import MessageAttachmentModel from 'models/MessageAttachmentModel';
import AttachmentsPreview from './preview/AttachmentsPreview';

type Props = {
  thread?: ThreadModel;
};

const inputClasses = {
  multiline: 'PL-chat-input-multiline',
} as const;

const StackStyled = styled(Stack)(({ theme }) => ({
  outline: `1px solid ${materialDesignSysPalette.outlineVariant}`,
  borderRadius: 32,
  padding: theme.spacing(1),
  transition: theme.transitions.create(
    ['border-radius', 'outline'], { duration: motion.duration.short2 }),
  [`&:has(.${inputClasses.multiline})`]: {
    borderRadius: 24,
  },
  [`&:has(.${inputBaseClasses.focused})`]: {
    outline: `2px solid ${materialDesignSysPalette.primary}`,
  },
}));

const ChatTextFieldRowInner: React.FC<Props> = ({ thread }) => {
  const { defaultTextFieldValue, apiRef } = useChatContext();

  const isTyping = useObserverValue(thread?.isTyping);
  const isLoadingAttachments = useObserverValue(thread?.isLoadingAttachments);

  const [text, setText] = React.useState(defaultTextFieldValue ?? '');
  const [attachments, setAttachments] = React.useState<MessageAttachmentModel[]>([]);

  const onSendMessage = async () => {
    let content: Message['content'] = text;
    if (attachments.length) {
      content = await Promise.all(attachments.map((a) => a.dataToContent()));
      console.log(content);
      if (text) {
        content = [
          { type: ChatMessageContentType.TEXT, text },
          ...content,
        ];
      }
    }

    apiRef.current?.sendUserMessage(content);
    setText('');

    attachments.forEach((a) => URL.revokeObjectURL(a.url));
    setAttachments([]);
  }

  const disabledTextField = !thread || isTyping || !!isLoadingAttachments?.length;
  const disabledButton = (!isTyping && !text && !attachments.length) || !!isLoadingAttachments?.length;

  return (
    <StackStyled>
      <AttachmentsPreview attachments={attachments} setAttachments={setAttachments} thread={thread} />
      <Stack direction="row" alignItems="flex-end" gap={1}>
        <FileAttachmentButton
          attachments={attachments}
          setAttachments={setAttachments}
          isTyping={isTyping}
        />
        <ChatTextField
          text={text}
          setText={setText}
          disabled={disabledTextField}
          classes={inputClasses}
          onSendMessage={onSendMessage}
        />
        <SendMessageButton
          isTyping={isTyping}
          disabled={disabledButton}
          onSendMessage={onSendMessage}
        />
      </Stack>
    </StackStyled >
  );
};

export default ChatTextFieldRowInner;
