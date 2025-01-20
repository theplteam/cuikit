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
import { ChatDialogue } from '../../models/ChatDialogue';

type Props = {
  dialogue?: ChatDialogue;
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
    width: `calc(100% - ${theme.spacing(paddingSidesSx*2)})`,
    height: 100,
    pointerEvents: 'none',
    zIndex: -1,
    background: `linear-gradient(180deg, rgba(255,255,255, 0), rgba(255,255,255, 1) 60%)`,
  },
}));

const InnerStackStyled = styled(Stack)(({ theme }) => ({
  outline: `1px solid ${theme.m3.sys.palette.outlineVariant}`,
  borderRadius: theme.m3.sys.shape.corner.superExtraLarge,
  padding: theme.spacing(1),
  transition: theme.transitions.create(
    ['border-radius', 'outline'], { duration: theme.m3.sys.motion.duration.short2 }),
  [`&:has(.${inputClasses.multiline})`]: {
    borderRadius: 24,
  },
  [`&:has(.${inputBaseClasses.focused})`]: {
    outline: `2px solid ${theme.m3.sys.palette.primary}`,
  },
}));

const ChatTextFieldRow: React.FC<Props> = ({ dialogue, scroller }) => {
  const { dialogueApi } = useDialogueContext();
  const isTyping = useObserverValue(dialogue?.isTyping);

  const [text, setText] = React.useState('');

  const messages = dialogueApi.current?.branch ?? [];

  const onSendMessage = async () => {
    if (text && dialogue) {
      const lastMessage = arrayLast(messages.filter(v => v.isUser));
      dialogue.messages.startNewMessageProcess();
      dialogue.sendMessage(lastMessage, text);
      setText('');
      await dialogue.messages.newMessagePromise;
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
