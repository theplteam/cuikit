import * as React from 'react';
import { keyframes, styled } from '@mui/material/styles';
import MessageContainer from './MessageContainer';
import MessageActionsAssistant from './actions/MessageActionsAssistant';
import { MessageModel } from '../../models/MessageModel';
import { ThreadModel } from '../../models/ThreadModel';
import { useObserverValue } from '../hooks/useObserverValue';
import { useChatSlots } from '../core/ChatSlotsContext';
import MessageReasoning from './reasoning/MessageReasoning';
import { useChatContext } from '../core/ChatGlobalContext';
import { useInternalMessageTransformer } from '../adapter/AdapterContext';
import Stack from '@mui/material/Stack';
import AssistantTextBlock from './AssistantTextBlock';
import { chatClassNames } from '../core/chatClassNames';
import { ChatViewConstants } from '../ChatViewConstants';
import { usePhotoswipeInitialization } from './hooks/usePhotoswipeInitialization';
import clsx from 'clsx';
import { useSmoothManager } from './markdown/smooth/useSmoothManager';

type Props = {
  message: MessageModel;
  enableAssistantActions?: boolean;
  thread: ThreadModel;
  elevation?: boolean;
};

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const MessageContainerStyled = styled(MessageContainer)(() => ({
  width: '100%',
  flexDirection: 'column',
  [`.${chatClassNames.markdownSmoothedPending}`]: {
    opacity: 0,
  },
  [`.${chatClassNames.markdownSmoothedAnimating}`]: {
    opacity: 0,
    // here `delay` has no meaning, since it is overwritten in style for each element
    animation: `${fadeIn} ${ChatViewConstants.TEXT_SMOOTH_ANIMATION_DURATION_MS}ms ease-in-out 0ms 1 normal forwards`,
  },
  /*[`&:not(.${latestMessageClassName})`]: {
    [`& .${actionsClassName}`]: {
      opacity: 0,
      transition: theme.transitions.create('opacity', { duration: motion.duration.short3 }),
    },
  },
  [`&.${hoverMessageClassName}`]: {
    [`& .${actionsClassName}`]: {
      opacity: 1,
    },
  }*/
}));

const MessageAssistant: React.FC<Props> = ({ message, enableAssistantActions, thread, elevation }) => {
  // const { element, setElement } = useElementRefState();

  // const isHover = useHover(element);
  const texts = useObserverValue(message.texts) ?? [];
  const typing = useObserverValue(message.typing);
  const { slots, slotProps } = useChatSlots();
  const { enableReasoning } = useChatContext();
  const [isTypedOnce, setIsTypedOnce] = React.useState(false);
  const messageBlockId = React.useMemo(() => `message-block-${message.id}`, [message.id]);

  React.useEffect(() => {
    if (typing && !isTypedOnce) {
      setIsTypedOnce(true);
    };
  }, [typing]);

  const getInternalMessage = useInternalMessageTransformer();
  const showControls = !typing && !!enableAssistantActions;

  const containerId = message.photoswipeContainerId;

  usePhotoswipeInitialization(containerId, typing);

  return (
    <MessageContainerStyled
      gap={1}
      className={chatClassNames.messageAssistantRoot}
      elevation={elevation}
      id={messageBlockId}
    >
      {enableReasoning ? (
        <MessageReasoning
          message={message}
        />
      ) : null}
      <Stack id={containerId} gap={1}>
        {texts.map((text, index) => (
          <AssistantTextBlock
            key={text.modelId}
            message={message}
            messageText={text}
            inProgress={!!typing}
            showStatus={texts.length === index + 1}
          />
        ))}
      </Stack>
      {showControls ? (
        <Stack       
          className={clsx({ [chatClassNames.markdownSmoothedPending]: isTypedOnce })}
          id={`footer-${message.id}`}
        >
          <MessageActionsAssistant
            message={message}
            thread={thread}
          />
          <slots.messageAssistantFooter
            {...slotProps.messageAssistantFooter}
            message={getInternalMessage(message)}
            className={slotProps.messageAssistantFooter?.className}
          />
        </Stack>
      ) : null}
    </MessageContainerStyled>
  );
};

export default MessageAssistant;
