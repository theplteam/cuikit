import * as React from 'react';
import { AdapterProvider, AdapterProviderProps, Message } from '@plteam/chat-ui';
import { AdapterMessage } from './AdapterApp';

const Adapter = (props: AdapterProviderProps) => {
  const messageOutputFormat = React.useCallback((message: Message) => {
    return {
      id: message.id,
      owner: message.role,
      text: message.content
    } as AdapterMessage;
  }, []);

  const transformMessage = React.useCallback((message: AdapterMessage) => {
    return {
      ...message,
      role: message.owner,
      content: message.text
    } as Message;
  }, []);

  return (
    <AdapterProvider
      transformMessage={transformMessage}
      messageOutputFormat={messageOutputFormat}
      {...props}
    />
  );
}

export default Adapter;
