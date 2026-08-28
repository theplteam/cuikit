import * as React from 'react';
import { styled } from '@mui/material/styles';
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
import { usePhotoswipeInitialization } from './hooks/usePhotoswipeInitialization';
import { useResolvedSpeed } from '../core/useResolvedSpeed';
import { triggerSmoothCheck } from './markdown/smooth/useSmoothManager';

type Props = {
  message: MessageModel;
  enableAssistantActions?: boolean;
  thread: ThreadModel;
  elevation?: boolean;
};

const {
  actionsClassName,
} = messageActionsClasses;

const MessageContainerStyled = styled(MessageContainer)(() => ({
  width: '100%',
  flexDirection: 'column',
}));

const MessageAssistant: React.FC<Props> = ({ message, enableAssistantActions, thread, elevation }) => {
  // const { element, setElement } = useElementRefState();

  // const isHover = useHover(element);
  const texts = useObserverValue(message.texts) ?? [];
  const typing = useObserverValue(message.typing);
  const { slots, slotProps } = useChatSlots();
  const { enableReasoning } = useChatContext();
  const speed = useResolvedSpeed();
  const [isTypedOnce, setIsTypedOnce] = React.useState(false);

  React.useEffect(() => {
    if (typing && !isTypedOnce) {
      setIsTypedOnce(true);
    };
  }, [typing]);

  // The action buttons + footer mount only once typing finishes, outside the streaming
  // text flow, so nothing else triggers the smoother for them. Kick a check here so their
  // pending -> animating fade actually runs. The manager's rerun guard makes this safe even
  // if the final text batch is still animating.
  React.useEffect(() => {
    if (!typing && enableAssistantActions && isTypedOnce) {
      triggerSmoothCheck(speed);
    }
  }, [typing, enableAssistantActions, isTypedOnce]);

  const getInternalMessage = useInternalMessageTransformer();

  const containerId = message.photoswipeContainerId;

  usePhotoswipeInitialization(containerId, typing);

  return (
    <MessageContainerStyled
      // ref={setElement}
      gap={1}
      className={clsx(
        chatClassNames.messageAssistantRoot,
      )}
      elevation={elevation}
    >
      {(enableReasoning) ? (
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
            showStatus={index === texts.length - 1}
            inProgress={!!typing}
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
