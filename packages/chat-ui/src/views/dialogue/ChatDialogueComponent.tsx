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
import { Thread, DMessage } from '../../models';
import Watermark from '../Watermark';
import { useChatSlots } from '../core/ChatSlotsContext';
import { ApiManager } from '../core/useApiManager';

type Props = {
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


const ChatDialogueComponent = <DM extends DMessage, DD extends Thread<DM>>({ contentRef, apiManager, enableBranches }: Props) => {
  const scrollApiRef = React.useRef<ChatScrollApiRef>({ handleBottomScroll: NOOP });

  const { thread, handleCreateNewThread, onAssistantMessageTypingFinish, onThreadCreated } = useChatContext<DM, DD>();
  const { slots, slotProps } = useChatSlots();

  React.useEffect(() => {
    if (!thread) {
      apiManager.apiRef.current?.openNewThread(handleCreateNewThread());
    }
  }, []);

  return (
    <DialogueProvider
      dialogue={thread}
      apiManager={apiManager}
      globalProps={{
        onAssistantMessageTypingFinish,
        enableBranches,
        onThreadCreated: onThreadCreated,
      }}
      scrollRef={scrollApiRef}
    >
      <slots.thread {...slotProps.thread}>
        <MessagesRowStyled
          justifyContent={thread?.messages.length ? 'stretch' : 'center'}
        >
          {!!thread && (
            <>
              <ChatMessages />
              {/*<QuestionsList thread={thread}/>*/}
            </>
          )}
        </MessagesRowStyled>
        {/*(!thread && !chat.currentDialogueInit) && <ChatNoDialogue chat={chat} />*/}
        <Watermark />
        <Stack position={'sticky'} bottom={0} zIndex={1}>
          <TextRowBlock>
            <ChatScroller dialogue={thread} contentRef={contentRef} scrollApiRef={scrollApiRef} />
            <ChatTextFieldRow dialogue={thread} />
          </TextRowBlock>
        </Stack>
        <MessageSelectedMobile />
      </slots.thread>
    </DialogueProvider>
  );
};

export default ChatDialogueComponent;
