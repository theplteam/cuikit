import * as React from 'react';
import { keyframes, styled } from '@mui/material/styles';
import MessageContainer from './MessageContainer';
import MessageActionsAssistant from './actions/MessageActionsAssistant';
import { MessageModel } from '../../models/MessageModel';
import { ThreadModel } from '../../models/ThreadModel';
import { useObserverValue } from '../hooks/useObserverValue';
import PhotoSwipeLightbox from '../photoswipe/PhotoSwipeLightbox';
import { useChatSlots } from '../core/ChatSlotsContext';
import MessageReasoning from './reasoning/MessageReasoning';
import { useChatContext } from '../core/ChatGlobalContext';
import { useInternalMessageTransformer } from '../adapter/AdapterContext';
import Stack from '@mui/material/Stack';
import AssistantTextBlock from './AssistantTextBlock';
import { chatClassNames } from '../core/chatClassNames';
import { ChatViewConstants } from '../ChatViewConstants';

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

  const getInternalMessage = useInternalMessageTransformer();
  const showControls = !typing && !!enableAssistantActions;

  const containerId = message.photoswipeContainerId;

  React.useEffect(() => {
    if (typing) return;
    const lightbox = PhotoSwipeLightbox({
      gallery: `#${message.photoswipeContainerId}`,
      children: `a.${chatClassNames.markdownImage}`,
      pswpModule: () => import('photoswipe'),
      zoom: false,
      showHideAnimationType: 'fade',
    });

    lightbox.init();

    return () => {
      lightbox.destroy();
    }
  }, [typing, containerId]);

  return (
    <MessageContainerStyled
      gap={1}
      className={chatClassNames.messageAssistantRoot}
      elevation={elevation}
    // ref={setElement} 
    // className={clsx(
    //   chatClassNames.messageAssistantRoot,
    //   { [hoverMessageClassName]: isHover },
    // )}
    >
      {enableReasoning ? (
        <MessageReasoning
          message={message}
        />
      ) : null}
      <Stack id={containerId} gap={1}>
        <slots.messageAssistantProgress
          {...slotProps.messageAssistantProgress}
          message={message}
        />
        {texts.map((text) => (
          <AssistantTextBlock
            key={text.modelId}
            message={message}
            messageText={text}
            inProgress={!!typing}
          />
        ))}
      </Stack>
      {showControls ? (
        <>
          <MessageActionsAssistant
            message={message}
            thread={thread}
          />
          <slots.messageAssistantFooter
            {...slotProps.messageAssistantFooter}
            message={getInternalMessage(message)}
            className={slotProps.messageAssistantFooter?.className}
          />
        </>
      ) : null}
    </MessageContainerStyled>
  );
};

export default MessageAssistant;
