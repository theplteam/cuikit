import * as React from 'react';
import { ChatMessageOwner, ThreadModel, MessageModel } from '../../models';
import { randomId } from '../../utils/numberUtils/randomInt';
import ChatMessageComponent from '../message/MessageComponent';
import { ForceStream } from '../../models/stream/ForceStream';
import { useChatContext } from 'views/core/ChatGlobalContext';

type Props = {
  thread: ThreadModel;
};

const HelloMessage: React.FC<Props> = ({ thread }) => {
  const { initialThreadMessage } = useChatContext();
  const messageConfig = initialThreadMessage?.(thread.id);

  const [message] = React.useState(new MessageModel({
    id: 'helloMessage' + randomId(),
    content: '',
    role: ChatMessageOwner.ASSISTANT,
    time: 0
  }));

  React.useEffect(() => {
    if (!messageConfig) return;

    if (!messageConfig.stream || thread.messages.allMessages.value.length > 0) {
      message.texts.value[0].observableText.value = messageConfig.text;
      return;
    }

    message.texts.value[0].observableText.value = '';
    const stream = new ForceStream(messageConfig.text, message);
    stream.chunkSize = 'medium';
    stream.speed = { min: 50, max: 200 };
    stream.start();

    return () => {
      stream.forceStop();
    }
  }, []);

  if (!messageConfig) return null;

  return (
    <ChatMessageComponent
      key="helloMessage"
      message={message}
      isLatest={false}
      isFirst={false}
      thread={thread}
      enableAssistantActions={false}
    />
  );
};

export default HelloMessage;
