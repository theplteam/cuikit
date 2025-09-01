import * as React from 'react';
import Stack, { StackProps } from '@mui/material/Stack';
import { styled, keyframes } from '@mui/material/styles';
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
import { chatClassNames } from '../core/chatClassNames';

type Props = {
  contentRef?: React.RefObject<HTMLDivElement | null>;
  loading?: boolean;
  enableBranches: boolean | undefined;
  apiManager: ApiManager;
  initialThread: Thread<Message> | undefined;
  className?: string;
};

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const MessagesRowStyled = styled(({ animationSpeed, ...props }: StackProps & { animationSpeed?: number }) => (
  <Stack {...props} />
))(({ animationSpeed })=> ({
  width: '100%',
  alignItems: 'center',
  flex: 1,
  paddingBottom: ChatViewConstants.MESSAGE_ROW_PADDING_BOTTOM,
  paddingTop: ChatViewConstants.MESSAGE_ROW_PADDING_TOP,
  boxSizing: 'border-box',
  [`.${chatClassNames.markdownSmoothedPending}`]: {
    opacity: 0,
  },
  [`.${chatClassNames.markdownSmoothedAnimating}`]: {
    opacity: 0,
    // here `delay` has no meaning, since it is overwritten in style for each element
    animation: `${fadeIn} ${animationSpeed ?? ChatViewConstants.TEXT_SMOOTH_ANIMATION_DURATION_MS}ms ease-in-out 0ms 1 normal forwards`,
  },
}));

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
    getConversationBlockHeightMin,
    typingSpeed,
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
          animationSpeed={typingSpeed}
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
