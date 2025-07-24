import * as React from 'react';
import { ThreadModel } from '../../models';
import ChatMessageComponent from '../message/MessageComponent';
import { ForceStream } from '../../models/stream/ForceStream';
import { useChatContext } from '../core/ChatGlobalContext';
import { useObserverValue } from '../../views/hooks/useObserverValue';

type Props = {
  thread: ThreadModel;
};

const InitialThreadMessage: React.FC<Props> = ({ thread }) => {
  const { initialThreadMessage } = useChatContext();
  const isLoadingFullData = useObserverValue(thread.isLoadingFullData);
  const messageConfig = React.useMemo(() => initialThreadMessage?.(thread.id), [thread.id, isLoadingFullData]);
  const message = thread.helloMessage;

  React.useEffect(() => {
    if (!messageConfig || message.text === messageConfig.text) return;
    message.text = '';
    if (messageConfig.stream) {
      message.typing.value = true;
      const stream = new ForceStream(messageConfig.text, message);
      stream.start();
    } else {
      message.text = messageConfig.text;
    }
  }, [thread.id, isLoadingFullData, messageConfig]);

  if (!messageConfig) return null;

  return (
    <ChatMessageComponent
      key="helloMessage"
      isLatest={false}
      isFirst={false}
      message={message}
      thread={thread}
      forceStream={messageConfig.stream}
      enableAssistantActions={false}
    />
  );
};

export default InitialThreadMessage;
