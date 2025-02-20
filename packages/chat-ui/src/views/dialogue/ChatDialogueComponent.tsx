import * as React from 'react';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import ChatMessages from '../message/ChatMessages';
import ChatTextFieldRow from '../form/ChatTextFieldRow';
import Box from '@mui/material/Box';
import { ChatViewConstants } from '../ChatViewConstants';
import MessageSelectedMobile from '../message/MessageSelectedMobile';
import ChatScroller, { ChatScrollApiRef } from './ChatScroller';
import { DialogueProvider } from './DialogueContext';
import { useChatContext } from '../core/ChatGlobalContext';
import { NOOP } from '../../utils/NOOP';
import { DDialogue, DMessage } from '../../models';
import Watermark from '../Watermark';
import { useChatSlots } from '../core/ChatSlotsContext';
import { ApiManager } from '../core/useApiManager';

type Props<DM extends DMessage, DD extends DDialogue<DM>> = {
  contentRef?: React.RefObject<HTMLDivElement | null>;
  disabled?: boolean;
  enableBranches: boolean | undefined;
  apiManager: ApiManager;
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
  background: theme.palette.background.paper,
}));


const ChatDialogueComponent = <DM extends DMessage, DD extends DDialogue<DM>>({ contentRef, apiManager, enableBranches }: Props<DM, DD>) => {
  const scrollApiRef = React.useRef<ChatScrollApiRef>({ handleBottomScroll: NOOP });

  const { dialogue, handleCreateNewDialogue, onAssistantMessageTypingFinish, onDialogueCreated } = useChatContext<DM, DD>();
  const { slots, slotProps } = useChatSlots();

  React.useEffect(() => {
    if (!dialogue) {
      apiManager.apiRef.current?.openNewDialogue(handleCreateNewDialogue());
    }
  }, []);

  return (
    <DialogueProvider
      dialogue={dialogue}
      apiManager={apiManager}
      globalProps={{
        onAssistantMessageTypingFinish,
        enableBranches,
        onDialogueCreated,
      }}
      scrollRef={scrollApiRef}
    >
      <slots.dialogue {...slotProps.dialogue}>
        <MessagesRowStyled
          justifyContent={dialogue?.messages.length ? 'stretch' : 'center'}
        >
          {!!dialogue && (
            <>
              <ChatMessages />
              {/*<QuestionsList dialogue={dialogue}/>*/}
            </>
          )}
        </MessagesRowStyled>
        {/*(!dialogue && !chat.currentDialogueInit) && <ChatNoDialogue chat={chat} />*/}
        <Watermark />
        <Stack position={'sticky'} bottom={0} zIndex={1}>
          <TextRowBlock>
            <ChatScroller dialogue={dialogue} contentRef={contentRef} scrollApiRef={scrollApiRef} />
            <ChatTextFieldRow dialogue={dialogue} />
          </TextRowBlock>
        </Stack>
        <MessageSelectedMobile />
      </slots.dialogue>
    </DialogueProvider>
  );
};

export default ChatDialogueComponent;
