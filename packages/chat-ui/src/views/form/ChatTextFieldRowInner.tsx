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
import ChatImagePreview from './preview/ChatImagePreview';
import ChatFilePreview from './preview/ChatFilePreview';
import { ChatMessageContentType, Message } from '../../models';
import MessageAttachmentModel from 'models/MessageAttachmentModel';
import Box from '@mui/material/Box';
import Scrollbar from '../../ui/Scrollbar';

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

  const images = attachments.filter((a) => a.isImage);
  const files = attachments.filter((a) => !a.isImage);
  const disabledTextField = !thread || isTyping;
  const disabledButton = (!isTyping && !text && !attachments.length) || !!isLoadingAttachments?.length;

  const handleDelete = (id: number, url: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
    URL.revokeObjectURL(url);
    if (thread) {
      thread.isLoadingAttachments.value = thread.isLoadingAttachments.value.filter((i) => i !== id);
    }
  };

  return (
    <StackStyled>
      <Box display="flex" flexDirection="column" gap={1}>
        <Scrollbar style={{ maxHeight: 64, borderRadius: 16 }}>
          {!!images.length && <ChatImagePreview images={images} handleDelete={handleDelete} />}
          {!!files.length && <ChatFilePreview files={files} handleDelete={handleDelete} />}
        </Scrollbar>
      </Box>
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
    </StackStyled>
  );
};

export default ChatTextFieldRowInner;
