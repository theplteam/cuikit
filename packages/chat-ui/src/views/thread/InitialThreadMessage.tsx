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
  const isSameText = message.text.trim() === messageConfig?.text.trim();

  React.useEffect(() => {
    if (!messageConfig || isSameText) return;

    message.text = '';
    const stream = new ForceStream(messageConfig.text, message);

    if (messageConfig.stream) {
      message.typing.value = true;
      stream.start();
    } else {
      message.text = messageConfig.text;
    }

    return () => {
      stream.forceStop();
    }
  }, [thread.id, messageConfig]);

  if (!messageConfig) return null;

  return (
    <ChatMessageComponent
      key="helloMessage"
      message={message}
      thread={thread}
      enableAssistantActions={false}
    />
  );
};

export default InitialThreadMessage;
