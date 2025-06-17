import * as React from 'react';
import { ChatMessageOwner, ThreadModel, MessageModel } from '../../models';
import { randomId } from '../../utils/numberUtils/randomInt';
import ChatMessageComponent from '../message/MessageComponent';
import { ForceStream } from '../../models/stream/ForceStream';
import { useChatContext } from '../core/ChatGlobalContext';
import { useObserverValue } from '../hooks/useObserverValue';

type Props = {
  thread: ThreadModel;
};

const HelloMessage: React.FC<Props> = ({ thread }) => {
  const { initialThreadMessage } = useChatContext();
  const isLoadingFullData = useObserverValue(thread?.isLoadingFullData);
  const messageConfig = React.useMemo(() => initialThreadMessage?.(thread.id), [thread.id]);

  const [message] = React.useState(new MessageModel({
    id: 'helloMessage' + randomId(),
    content: '',
    role: ChatMessageOwner.ASSISTANT,
    time: 0
  }));

  React.useEffect(() => {
    if (!messageConfig) return;
    if (!messageConfig.stream) {
      message.texts.value[0].observableText.value = messageConfig.text;
    } else {
      message.texts.value[0].observableText.value = '';
      const stream = new ForceStream(message);
      stream.start(messageConfig.text);
    }
  }, [thread.id]);

  if (!messageConfig || isLoadingFullData) return null;

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
