import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { ThreadModel } from '../../models/ThreadModel';
import { useChatSlots } from '../core/ChatSlotsContext';
import { ChatViewConstants } from '../ChatViewConstants';

type Props = {
  thread?: ThreadModel;
};

const paddingSidesSx = 1.5;
const ThreadWidthBlockStyled = styled(Box)(({ theme }) => ({
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

const ChatTextFieldRow: React.FC<Props> = ({ thread }) => {
  const { slots, slotProps } = useChatSlots();

  return (
    <ThreadWidthBlockStyled id={ChatViewConstants.TEXT_FIELD_ROW_ID}>
      <slots.messageRowInner
        {...slotProps.messageRowInner}
        thread={thread}
      />
    </ThreadWidthBlockStyled>
  );
};

export default ChatTextFieldRow;
