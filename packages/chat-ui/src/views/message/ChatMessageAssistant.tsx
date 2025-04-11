import * as React from 'react';
import { styled } from '@mui/material/styles';
import ChatMessageContainer from './ChatMessageContainer';
import { ChatViewConstants } from '../ChatViewConstants';
import ChatMarkdownBlock from './markdown/ChatMarkdownBlock';
import MessageActionsAssistant from './actions/MessageActionsAssistant';
import { clsx } from 'clsx';
import { messageActionsClasses } from './messageActionsClasses';
import { NOOP } from '../../utils/NOOP';
import { MessageModel } from '../../models/MessageModel';
import { ThreadModel } from '../../models/ThreadModel';
import { useObserverValue } from '../hooks/useObserverValue';
import useHover from '../hooks/useHover';
import { useElementRefState } from '../hooks/useElementRef';
import PhotoSwipeLightbox from '../photoswipe/PhotoSwipeLightbox';
import { motion } from '../../utils/materialDesign/motion';
import { useChatSlots } from '../core/ChatSlotsContext';
import MessageReasoning from './reasoning/MessageReasoning';
import { useChatContext } from '../core/ChatGlobalContext';
import { useInternalMessageTransformer } from '../adapter/AdapterContext';

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
  hoverMessageClassName,
} = messageActionsClasses;

const ChatMessageContainerStyled = styled(ChatMessageContainer)(({ theme }) => ({
  width: '100%',
  flexDirection: 'column',
  [`&:not(.${latestMessageClassName})`]: {
    [`& .${actionsClassName}`]: {
      opacity: 0,
      transition: theme.transitions.create('opacity', { duration: motion.duration.short3 }),
    },
  },
  [`&.${hoverMessageClassName}`]: {
    [`& .${actionsClassName}`]: {
      opacity: 1,
    },
  }
}));

const ChatMessageAssistant: React.FC<Props> = ({ message, enableAssistantActions, thread, isLatest, elevation }) => {
  const { element, setElement } = useElementRefState();

  const isHover = useHover(element);
  const text = useObserverValue(message.observableText);
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

  const blockText = React.useMemo(
    () => text ? (
      <ChatMarkdownBlock
        id={containerId}
        text={text}
        rootComponent={slots.markdownMessageRoot}
        rootComponentProps={slotProps.markdownMessageRoot}
      />
    ) : null,
    [text, slots.markdownMessageRoot, slotProps.markdownMessageRoot]
  );

  return (
    <ChatMessageContainerStyled
      ref={setElement}
      gap={1}
      className={clsx(
        { [latestMessageClassName]: isLatest },
        { [hoverMessageClassName]: isHover },
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
      {isLatest ? (
        <slots.messageAssistantProgress
          {...slotProps.messageAssistantProgress}
          message={message}
          thread={thread}
        />
      ) : null}
      {blockText}
      {((!typing && !!text) && enableAssistantActions) ? (
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
