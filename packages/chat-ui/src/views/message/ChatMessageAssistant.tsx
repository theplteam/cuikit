import * as React from 'react';
import { styled } from '@mui/material/styles';
import ChatMessageContainer from './ChatMessageContainer';
import { randomId } from '../../utils/numberUtils/randomInt';
import { ChatViewConstants } from '../ChatViewConstants';
import ChatMarkdownBlock from './markdown/ChatMarkdownBlock';
import MessageActionsAssistant from './actions/MessageActionsAssistant';
import { clsx } from 'clsx';
import { messageActionsClasses } from './messageActionsClasses';
import { NOOP } from '../../utils/NOOP';
import { MessageLight } from '../../models/Message';
import { DialogueLight } from '../../models/Dialogue';
import { useObserverValue } from '../hooks/useObserverValue';
import useHover from '../hooks/useHover';
import { useElementRefState } from '../hooks/useElementRef';
import PhotoSwipeLightbox from '../photoswipe/PhotoSwipeLightbox';
import { motion } from '../../utils/materialDesign/motion';
import { useChatSlots } from '../core/ChatSlotsContext';

type Props = {
  message: MessageLight;
  enableAssistantActions?: boolean;
  dialogue: DialogueLight;
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

const ChatMessageAssistant: React.FC<Props> = ({ message, enableAssistantActions, dialogue, isLatest, elevation }) => {
  const { element, setElement } = useElementRefState();

  const isHover = useHover(element);
  const text = useObserverValue(message.observableText);
  const typing = useObserverValue(message.typing);
  const containerId = React.useState('pswp-chat-gallery' + randomId())[0];
  const { slots, slotProps } = useChatSlots();

  React.useEffect(() => {
    if (typing) return NOOP;

    const lightbox = PhotoSwipeLightbox({
      gallery: `#${containerId}`,
      children: `a.${ChatViewConstants.MARKDOWN_IMAGE_CLASSNAME}`,
      pswpModule: () => import('photoswipe'),
      zoom: false,
      showHideAnimationType: 'fade',
    });

    lightbox.init();

    return () => {
      lightbox.destroy();
    }
  }, [typing]);

  const blockText = React.useMemo(
    () => text ? <ChatMarkdownBlock id={containerId} text={text} /> : null,
    [text]
  );

  return (
    <ChatMessageContainerStyled
      gap={1}
      className={clsx(
        { [latestMessageClassName]: isLatest },
        { [hoverMessageClassName]: isHover },
      )}
      ref={setElement}
      elevation={elevation}
    >
      {blockText}
      {isLatest && <slots.messageAssistantProgress {...slotProps.messageAssistantProgress} dialogue={dialogue}/>}
      {(!typing && !!text && enableAssistantActions) && (
        <MessageActionsAssistant
          message={message}
          dialogue={dialogue}
          className={actionsClassName}
        />
      )}
      <slots.messageAssistantFooter {...slotProps.messageAssistantFooter} message={message} />
    </ChatMessageContainerStyled>
  );
};

export default ChatMessageAssistant;
