import * as React from 'react';
import { AdapterProvider, AdapterProviderProps } from './AdapterProvider';
import { ChatMessageOwner } from '../../models';

const ChatGptAdapter: React.FC<AdapterProviderProps> = (props) => {
  const transformMessage = React.useCallback((message: any) => {
    let content = message.content || '';

    if (!message.content && !!message.choices) {
      try {
        content = message.choices[0].message.content;
        message.role = ChatMessageOwner.ASSISTANT;
      } catch (e) {
        console.error(e);
      }
    }

    // TODO: timed
    if (typeof content !== 'string') {
      content = content[0].text;
    }

    return { ...message, content };
  }, []);

  return (
    <AdapterProvider transformMessage={transformMessage} {...props} />
  );
}

export default ChatGptAdapter;
