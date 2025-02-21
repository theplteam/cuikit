import * as React from 'react';
import { styled } from '@mui/material/styles';
import ChatTextField from './ChatTextField';
import Stack from '@mui/material/Stack';
import SendMessageButton from './SendMessageButton';
import Box from '@mui/material/Box';
import { inputBaseClasses } from '@mui/material/InputBase';
import { useObserverValue } from '../hooks/useObserverValue';
import { ThreadModel } from '../../models/ThreadModel';
import { materialDesignSysPalette } from '../../utils/materialDesign/palette';
import { motion } from '../../utils/materialDesign/motion';
import PinPictureButton from './PinPictureButton';
import { useChatContext } from '../core/ChatGlobalContext';
import ChatImagePreview from './ChatImagePreview';
import { DMessage } from '../../models';

type Props = {
  thread?: ThreadModel;
};

const inputClasses = {
  multiline: 'PL-chat-input-multiline',
} as const;

const paddingSidesSx = 1.5;
const DialogueWidthBlockStyled = styled(Box)(({ theme }) => ({
  boxSizing: 'border-box',
  width: '100%',
  padding: theme.spacing(0, paddingSidesSx, 1, paddingSidesSx),
  backgroundColor: theme.palette.common.white,
  alignItems: 'center',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: -50,
    bottom: 0,
    width: `calc(100% - ${theme.spacing(paddingSidesSx * 2)})`,
    height: 100,
    pointerEvents: 'none',
    zIndex: -1,
    background: `linear-gradient(180deg, rgba(255,255,255, 0), rgba(255,255,255, 1) 60%)`,
  },
}));

const InnerStackStyled = styled(Stack)(({ theme }) => ({
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

const ChatTextFieldRow: React.FC<Props> = ({ thread }) => {
  const { defaultTextFieldValue, apiRef } = useChatContext();

  const isTyping = useObserverValue(thread?.isTyping);

  const [text, setText] = React.useState(defaultTextFieldValue ?? '');
  const [images, setImages] = React.useState<string[]>([]);

  const onSendMessage = async () => {
    let content: DMessage['content'] = text;
    if (images.length) {
      content = images.map(v => ({ type: 'image_url', image_url: { url: v } }));

      if (!!text) {
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

  const disabled = !thread || isTyping;

  return (
    <DialogueWidthBlockStyled>
      <InnerStackStyled>
        {!!images.length && <ChatImagePreview images={images} setImages={setImages} />}
        <Stack direction={'row'} alignItems={'flex-end'} gap={1}>
          <PinPictureButton
            images={images}
            setImages={setImages}
            isTyping={isTyping}
          />
          <ChatTextField
            text={text}
            setText={setText}
            onSendMessage={onSendMessage}
            disabled={disabled}
            classes={inputClasses}
          />
          <SendMessageButton
            onSendMessage={onSendMessage}
            isTyping={isTyping}
            text={text}
            images={images}
          />
        </Stack>
      </InnerStackStyled>
    </DialogueWidthBlockStyled>
  );
};

export default ChatTextFieldRow;
