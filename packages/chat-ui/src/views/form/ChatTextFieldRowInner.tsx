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
import PinPictureButton from './PinPictureButton';
import { useChatContext } from '../core/ChatGlobalContext';
import ChatImagePreview from './ChatImagePreview';
import { Message } from '../../models';

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
  const isLoadingFullData = useObserverValue(thread?.isLoadingFullData);

  const [text, setText] = React.useState(defaultTextFieldValue ?? '');
  const [images, setImages] = React.useState<string[]>([]);

  const onSendMessage = async () => {
    let content: Message['content'] = text;
    if (images.length) {
      content = images.map(v => ({ type: 'image_url', image_url: { url: v } }));

      if (text) {
        content = [
          { type: 'text', text },
          ...content,
        ];
      }
    }

    apiRef.current?.sendUserMessage(content);

    setText('');
    setImages([]);
  }

  const disabled = !thread || isTyping || isLoadingFullData;

  return (
    <StackStyled>
      {!!images.length && <ChatImagePreview images={images} setImages={setImages} />}
      <Stack direction="row" alignItems="flex-end" gap={1}>
        <PinPictureButton
          images={images}
          setImages={setImages}
          isTyping={isTyping}
        />
        <ChatTextField
          text={text}
          setText={setText}
          disabled={disabled}
          classes={inputClasses}
          onSendMessage={onSendMessage}
        />
        <SendMessageButton
          isTyping={isTyping}
          text={text}
          images={images}
          isLoadingFullData={isLoadingFullData}
          onSendMessage={onSendMessage}
        />
      </Stack>
    </StackStyled>
  );
};

export default ChatTextFieldRowInner;
