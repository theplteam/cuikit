import * as React from 'react';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import ChatMessages from '../message/ChatMessages';
import ChatTextFieldRow from '../form/ChatTextFieldRow';
import Box from '@mui/material/Box';
import { ChatViewConstants } from '../ChatViewConstants';
import MessageSelectedMobile from '../message/MessageSelectedMobile';
import ChatScroller, { ChatScrollApiRef } from './ChatScroller';
import { ThreadProvider } from './ThreadContext';
import { useChatContext } from '../core/ChatGlobalContext';
import { NOOP } from '../../utils/NOOP';
import { Thread, Message } from '../../models';
import Watermark from '../Watermark';
import { useChatSlots } from '../core/ChatSlotsContext';
import { ApiManager } from '../core/useApiManager';
import { useObserverValue } from '../hooks/useObserverValue';

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

const ThreadComponent = <DM extends Message, DD extends Thread<DM>>({ contentRef, apiManager, enableBranches }: Props) => {
  const scrollApiRef = React.useRef<ChatScrollApiRef>({ handleBottomScroll: NOOP });

  const {
    handleCreateNewThread,
    onAssistantMessageTypingFinish,
    onFirstMessageSent,
    getCurrentBranch,
    model,
    beforeUserMessageSend
  } = useChatContext<DM, DD>();

  const thread = useObserverValue(model.currentThread);

  const { slots, slotProps } = useChatSlots();

  React.useEffect(() => {
    if (!thread) {
      apiManager.apiRef.current?.openNewThread(handleCreateNewThread());
    }
  }, []);

  return (
    <ThreadProvider
      thread={thread}
      model={model}
      apiManager={apiManager}
      globalProps={{
        onAssistantMessageTypingFinish,
        enableBranches,
        onFirstMessageSent,
        beforeUserMessageSend,
        getCurrentBranch,
      }}
      scrollRef={scrollApiRef}
    >
      <slots.thread id={ChatViewConstants.DIALOGUE_ROOT_ID} {...slotProps.thread}>
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
        {/*(!thread && !chat.currentThreadInit) && <ChatNoThread chat={chat} />*/}
        <Watermark />
        <Stack position="sticky" bottom={0} zIndex={1}>
          <TextRowBlock>
            <ChatScroller
              thread={thread}
              contentRef={contentRef}
              scrollApiRef={scrollApiRef}
              apiManager={apiManager}
            />
            <ChatTextFieldRow thread={thread} />
          </TextRowBlock>
        </Stack>
        <MessageSelectedMobile />
      </slots.thread>
    </ThreadProvider>
  );
};

export default ThreadComponent;
