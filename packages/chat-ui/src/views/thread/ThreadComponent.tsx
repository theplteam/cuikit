import * as React from 'react';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import ChatMessages from '../message/MessagesComponent';
import ChatTextFieldRow from '../form/ChatTextFieldRow';
import Box from '@mui/material/Box';
import { ChatViewConstants } from '../ChatViewConstants';
import MessageSelectedMobile from '../message/MessageSelectedMobile';
import ChatScroller, { ChatScrollApiRef } from './ChatScroller';
import { ThreadProvider } from './ThreadContext';
import { useChatContext } from '../core/ChatGlobalContext';
import { NOOP } from '../../utils/NOOP';
import { Thread, Message } from '../../models';
import { useChatSlots } from '../core/ChatSlotsContext';
import { ApiManager } from '../core/useApiManager';
import { useObserverValue } from '../hooks/useObserverValue';

type Props = {
  contentRef?: React.RefObject<HTMLDivElement | null>;
  loading?: boolean;
  enableBranches: boolean | undefined;
  apiManager: ApiManager;
  initialThread: Thread<Message> | undefined;
  className?: string;
};

const MessagesRowStyled = styled(Stack)({
  width: '100%',
  alignItems: 'center',
  flex: 1,
  paddingBottom: ChatViewConstants.MESSAGE_ROW_PADDING_BOTTOM,
  paddingTop: ChatViewConstants.MESSAGE_ROW_PADDING_TOP,
  boxSizing: 'border-box',
});

const TextRowBlock = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: ChatViewConstants.TEXT_BLOCK_HEIGHT,
  display: 'flex',
  justifyContent: 'center',
  background: theme.palette.background.paper,
}));

const ThreadComponent = <DM extends Message, DD extends Thread<DM>>({ contentRef, className, loading, apiManager, enableBranches, initialThread }: Props) => {
  const scrollApiRef = React.useRef<ChatScrollApiRef>({ handleBottomScroll: NOOP });

  const {
    handleCreateNewThread,
    onAssistantMessageTypingFinish,
    onFirstMessageSent,
    getCurrentBranch,
    model,
    beforeUserMessageSend,
    getConversationBlockHeightMin
  } = useChatContext<DM, DD>();

  const thread = useObserverValue(model.currentThread);

  const { slots, slotProps } = useChatSlots();

  React.useEffect(() => {
    if (!initialThread && !loading) {
      apiManager.apiRef.current?.openNewThread(handleCreateNewThread());
    }
  }, [loading]);

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
        getConversationBlockHeightMin,
      }}
      contentRef={contentRef}
      scrollRef={scrollApiRef}
    >
      <slots.thread id={ChatViewConstants.DIALOGUE_ROOT_ID} {...slotProps.thread} className={className}>
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
        {/*<Watermark/>*/}
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
