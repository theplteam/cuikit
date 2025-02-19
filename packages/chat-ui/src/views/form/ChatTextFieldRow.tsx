import * as React from 'react';
import { styled } from '@mui/material/styles';
import ChatTextField from './ChatTextField';
import Stack from '@mui/material/Stack';
import SendMessageButton from './SendMessageButton';
import Box from '@mui/material/Box';
import { inputBaseClasses } from '@mui/material/InputBase';
import { arrayLast } from '../../utils/arrayUtils/arrayLast';
import { useDialogueContext } from '../DialogueContext';
import { useObserverValue } from '../hooks/useObserverValue';
import { Dialogue, StreamResponseState } from '../../models/Dialogue';
import { materialDesignSysPalette } from '../../utils/materialDesign/palette';
import { motion } from '../../utils/materialDesign/motion';
import PinPictureButton from './PinPictureButton';
import { useChatContext } from '../core/ChatGlobalContext';
import ChatImagePreview from './ChatImagePreview';

type Props = {
  dialogue?: Dialogue;
  scroller: {
    handleBottomScroll?: () => void;
  };
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

const ChatTextFieldRow: React.FC<Props> = ({ dialogue, scroller }) => {
  const { apiRef } = useDialogueContext();
  const dialogueApi = apiRef.current?.dialogue
  const { onDialogueCreated, onAssistantMessageTypingFinish, defaultTextFieldValue } = useChatContext();
  const isTyping = useObserverValue(dialogue?.isTyping);

  const [text, setText] = React.useState(defaultTextFieldValue ?? '');
  const [images, setImages] = React.useState<string[]>([]);

  const onSendMessage = async () => {
    const messages = dialogueApi?.branch.value ?? [];
    if ((images.length || text) && dialogue) {
      const lastMessage = arrayLast(messages.filter(v => v.isUser));
      apiRef.current?.setProgressStatus(StreamResponseState.START);
      const createdNew = await dialogue.createIfEmpty();
      if (createdNew) {
        onDialogueCreated?.(dialogue.data.data);
      }
      dialogue.sendMessage(lastMessage, text, images)
        .then(() => {
          onAssistantMessageTypingFinish?.(dialogue.data.data);
          apiRef.current?.setProgressStatus(StreamResponseState.FINISH_MESSAGE);
        });

      setText('');
      setImages([]);
      scroller.handleBottomScroll?.();
    }
  }

  const disabled = !dialogue || isTyping;

  return (
    <DialogueWidthBlockStyled>
      <InnerStackStyled>
        <ChatImagePreview images={images} setImages={setImages} />
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
