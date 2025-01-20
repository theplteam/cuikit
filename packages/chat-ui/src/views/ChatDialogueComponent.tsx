import * as React from 'react';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import ChatMessages from './message/ChatMessages';
import ChatTextFieldRow from './form/ChatTextFieldRow';
import Box from '@mui/material/Box';
import { ChatViewConstants } from './ChatViewConstants';
import MessageSelectedMobile from './message/MessageSelectedMobile';
import ChatScroller, { ChatScrollApiRef } from './ChatScroller';
import { DialogueProvider } from './DialogueContext';
import { DialogueApi } from './DialogueApi';
import { useChatContext } from './ChatGlobalContext';
import { NOOP } from '../utils/NOOP';

type Props = {
  contentRef?: React.RefObject<HTMLDivElement | null>;
  disabled?: boolean;
};

const MessagesRowStyled = styled(Stack)(({ theme }) => ({
  width: '100%',
  alignItems: 'center',
  flex: 1,
  paddingBottom: theme.spacing(4),
  paddingTop: theme.spacing(1),
  boxSizing: 'border-box',
}));

const TextRowBlock = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: ChatViewConstants.TEXT_BLOCK_HEIGHT,
  display: 'flex',
  justifyContent: 'center',
  position: 'sticky',
  bottom: 0,
  zIndex: 1,
  background: theme.palette.background.paper,
}));


const ChatDialogueComponent: React.FC<Props> = ({ contentRef }) => {
  const dialogueRef = React.useRef<DialogueApi | undefined>(undefined);
  const scrollApiRef = React.useRef<ChatScrollApiRef>({ handleBottomScroll: NOOP });

  const { dialogue } = useChatContext();

  return (
    <DialogueProvider
      dialogue={dialogue}
      dialogueRef={dialogueRef}
    >
      <MessagesRowStyled
        justifyContent={!!dialogue?.messages.length ? 'stretch' : 'center'}
      >
        {!!dialogue && (
          <>
            <ChatMessages />
            {/*<QuestionsList dialogue={dialogue}/>*/}
          </>
        )}
      </MessagesRowStyled>
      {/*(!dialogue && !chat.currentDialogueInit) && <ChatNoDialogue chat={chat} />*/}
      <TextRowBlock>
        <ChatScroller dialogue={dialogue} contentRef={contentRef} scrollApiRef={scrollApiRef} />
        <ChatTextFieldRow dialogue={dialogue} scroller={scrollApiRef.current} />
      </TextRowBlock>
      <MessageSelectedMobile />
    </DialogueProvider>
  );
};

export default ChatDialogueComponent;
