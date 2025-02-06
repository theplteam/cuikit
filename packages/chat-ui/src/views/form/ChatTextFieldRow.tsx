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
import { DialogueAbstract, StreamResponseState } from '../../models/DialogueAbstract';
import { materialDesignSysPalette } from '../../utils/materialDesign/palette';
import { motion } from '../../utils/materialDesign/motion';
import { useChatModel } from '../core/ChatGlobalContext';
import PinPictureButton from './PinPictureButton';

type Props = {
  dialogue?: DialogueAbstract;
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
    bottom: '0',
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
  const { dialogueApi } = useDialogueContext();
  const chat = useChatModel();
  const isTyping = useObserverValue(dialogue?.isTyping);

  const [text, setText] = React.useState('');
  const [image, setImage] = React.useState<string>('');

  const onSendMessage = async () => {
    const messages = dialogueApi.current?.branch.value ?? [];
    if (text && dialogue) {
      const lastMessage = arrayLast(messages.filter(v => v.isUser));
      dialogueApi.current?.setProgressStatus(StreamResponseState.START);
      const createdNew = await dialogue.createIfEmpty();
      if (createdNew) {
        chat.dialogueActions.open(dialogue);
      }
      dialogue.sendMessage(lastMessage, text, image)
        .then(() => {
          chat.dialogueActions.touch(dialogue);
          dialogueApi.current?.setProgressStatus(StreamResponseState.FINISH_MESSAGE);
        });

      setText('');
      setImage('');
      scroller.handleBottomScroll?.();
    }
  }

  const disabled = !dialogue || isTyping;

  return (
    <DialogueWidthBlockStyled>
      <InnerStackStyled
        direction={'row'}
        alignItems={'flex-end'}
        gap={1}
      >
        <PinPictureButton
          image={image}
          setImage={setImage}
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
          dialogue={dialogue}
          onSendMessage={onSendMessage}
          isTyping={isTyping}
          text={text}
        />
      </InnerStackStyled>
    </DialogueWidthBlockStyled>
  );
};

export default ChatTextFieldRow;
