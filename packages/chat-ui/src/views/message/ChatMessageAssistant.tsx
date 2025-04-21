import * as React from 'react';
import { styled } from '@mui/material/styles';
import ChatMessageContainer from './ChatMessageContainer';
import { ChatViewConstants } from '../ChatViewConstants';
import MessageActionsAssistant from './actions/MessageActionsAssistant';
import { clsx } from 'clsx';
import { messageActionsClasses } from './messageActionsClasses';
import { NOOP } from '../../utils/NOOP';
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

const ChatMessageContainerStyled = styled(ChatMessageContainer)(() => ({
  width: '100%',
  flexDirection: 'column',
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

const ChatMessageAssistant: React.FC<Props> = ({ message, enableAssistantActions, thread, isLatest, elevation }) => {
  // const { element, setElement } = useElementRefState();

  // const isHover = useHover(element);
  const texts = useObserverValue(message.texts) ?? [];
  const typing = useObserverValue(message.typing);
  const { slots, slotProps } = useChatSlots();
  const { enableReasoning } = useChatContext();
  const getInternalMessage = useInternalMessageTransformer();

  const containerId = message.photoswipeContainerId;

  React.useEffect(() => {
    if (typing) return NOOP;
    const lightbox = PhotoSwipeLightbox({
      gallery: `#${message.photoswipeContainerId}`,
      children: `a.${ChatViewConstants.MARKDOWN_IMAGE_CLASSNAME}`,
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
    <ChatMessageContainerStyled
      // ref={setElement}
      gap={1}
      className={clsx(
        { [latestMessageClassName]: isLatest },
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
          />
        ))}
      </Stack>
      {(!typing && enableAssistantActions) ? (
        <MessageActionsAssistant
          message={message}
          thread={thread}
          className={actionsClassName}
        />
      ) : null}
      {!!enableAssistantActions && <slots.messageAssistantFooter {...slotProps.messageAssistantFooter} message={getInternalMessage(message)} />}
    </ChatMessageContainerStyled>
  );
};

export default ChatMessageAssistant;
