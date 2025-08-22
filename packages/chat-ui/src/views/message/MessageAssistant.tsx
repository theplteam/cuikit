import * as React from 'react';
import { keyframes, styled } from '@mui/material/styles';
import MessageContainer from './MessageContainer';
import MessageActionsAssistant from './actions/MessageActionsAssistant';
import { clsx } from 'clsx';
import { messageActionsClasses } from './messageActionsClasses';
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

type Props = {
  message: MessageModel;
  enableAssistantActions?: boolean;
  thread: ThreadModel;
  isLatest?: boolean;
  elevation?: boolean;
};

const {
  latestMessageClassName,
  actionsClassName,
} = messageActionsClasses;

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

const MessageAssistant: React.FC<Props> = ({ message, enableAssistantActions, thread, isLatest, elevation }) => {
  // const { element, setElement } = useElementRefState();

  // const isHover = useHover(element);
  const texts = useObserverValue(message.texts) ?? [];
  const typing = useObserverValue(message.typing);
  const { slots, slotProps } = useChatSlots();
  const { enableReasoning } = useChatContext();
  const [isTypedOnce, setIsTypedOnce] = React.useState(false);

  React.useEffect(() => {
    if (typing && !isTypedOnce) {
      setIsTypedOnce(true);
    };
  }, [typing]);

  const getInternalMessage = useInternalMessageTransformer();

  const containerId = message.photoswipeContainerId;

  usePhotoswipeInitialization(containerId, typing);

  return (
    <MessageContainerStyled
      // ref={setElement}
      gap={1}
      className={clsx(
        { [latestMessageClassName]: isLatest },
        chatClassNames.messageAssistantRoot,
        // { [hoverMessageClassName]: isHover },
      )}
      elevation={elevation}
    >
      {(enableReasoning) ? (
        <MessageReasoning
          message={message}
          thread={thread}
          isLatest={isLatest}
        />
      ) : null}
      <Stack id={containerId} gap={1}>
        {texts.map((text, index) => (
          <AssistantTextBlock
            key={text.modelId}
            message={message}
            thread={thread}
            messageText={text}
            showStatus={!!isLatest && (index === texts.length - 1)}
            inProgress={!!isLatest && !!typing}
          />
        ))}
      </Stack>
      {(!typing && enableAssistantActions) ? (
        <MessageActionsAssistant
          message={message}
          thread={thread}
          className={actionsClassName}
          isTypedOnce={isTypedOnce}
        />
      ) : null}
      {(!typing && !!enableAssistantActions) && (
        <slots.messageAssistantFooter
          {...slotProps.messageAssistantFooter}
          message={getInternalMessage(message)}
          className={clsx(
            { [chatClassNames.markdownSmoothedPending]: isTypedOnce },
            slotProps.messageAssistantFooter?.className,
          )}
        />
      )}
    </MessageContainerStyled>
  );
};

export default MessageAssistant;
