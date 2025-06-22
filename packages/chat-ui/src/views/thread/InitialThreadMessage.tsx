import * as React from 'react';
import { ThreadModel } from '../../models';
import ChatMessageComponent from '../message/MessageComponent';
import { ForceStream } from '../../models/stream/ForceStream';
import { useChatContext } from '../core/ChatGlobalContext';

type Props = {
  thread: ThreadModel;
};

const InitialThreadMessage: React.FC<Props> = ({ thread }) => {
  const { initialThreadMessage } = useChatContext();
  const messageConfig = React.useMemo(() => initialThreadMessage?.(thread.id), [thread.id]);
  const message = thread.helloMessage;

  React.useEffect(() => {
    if (!messageConfig || message.text) return;
    if (messageConfig.stream) {
      message.typing.value = true;
      const stream = new ForceStream(messageConfig.text, message);
      stream.start();
    } else {
      message.text = messageConfig.text;
    }
  }, [thread.id, messageConfig]);

  if (!messageConfig) return null;

  return (
    <ChatMessageComponent
      key="helloMessage"
      isLatest={messageConfig.stream}
      message={message}
      isFirst={false}
      thread={thread}
      enableAssistantActions={false}
    />
  );
};

export default InitialThreadMessage;
