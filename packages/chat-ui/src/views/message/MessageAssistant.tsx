import * as React from 'react';
import { styled } from '@mui/material/styles';
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
import { usePhotoswipeInitialization } from './hooks/usePhotoswipeInitialization';
import clsx from 'clsx';

type Props = {
  message: MessageModel;
  enableAssistantActions?: boolean;
  thread: ThreadModel;
  elevation?: boolean;
};

const MessageContainerStyled = styled(MessageContainer)(() => ({
  width: '100%',
  flexDirection: 'column',
}));

const MessageAssistant: React.FC<Props> = ({ message, enableAssistantActions, thread, elevation }) => {
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
