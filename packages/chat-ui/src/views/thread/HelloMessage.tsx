import * as React from 'react';
import { ChatMessageOwner, ThreadModel, MessageModel } from '../../models';
import { randomId } from '../../utils/numberUtils/randomInt';
import ChatMessageComponent from '../message/ChatMessageComponent';
import { ForceStream } from '../../models/stream/ForceStream';

type Props = {
  text?: string;
  dialogue?: ThreadModel;
};

const HelloMessage: React.FC<Props> = ({ text, dialogue }) => {
  const [message] = React.useState(new MessageModel({
    id: 'helloMessage' + randomId(),
    content: '',
    role: ChatMessageOwner.ASSISTANT,
    time: 0
  }));

  React.useEffect(() => {
    if (!dialogue || !text) return;

    if (dialogue.messages.allMessages.value.length > 0) {
      message.observableText.value = text;
      return;
    }

    message.observableText.value = '';
    const stream = new ForceStream(text, message);
    stream.chunkSize = 'medium';
    stream.speed = { min: 50, max: 200 };
    stream.start();

    return () => {
      stream.forceStop();
    }
  }, [dialogue?.id, text]);

  if (!dialogue || !text) return null;

  return (
    <ChatMessageComponent
      message={message}
      key={'helloMessage'}
      isLatest={false}
      isFirst={false}
      thread={dialogue}
      enableAssistantActions={false}
    />
  );
};

export default HelloMessage;
