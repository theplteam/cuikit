import * as React from 'react';
import Stack from '@mui/material/Stack';
import { Message } from '../../../../models/Message';
import { lng } from '../../../../utils/lng';
import MessageFeedbackButton, { FeedbackType } from './MessageFeedbackButton';
import MessageFeedbackWindow from './MessageFeedbackWindow';

type Props = {
  message: Message;
};

const MessageActionFeedback: React.FC<Props> = ({ message }) => {
  const [feedback, setFeedback] = React.useState<FeedbackType | undefined>(undefined);

  const handleClick = (action: FeedbackType) => {
    const newValue = feedback === action ? undefined : action;
    setFeedback(newValue);
    console.log('ID', message.id);
  }

  return (
    <Stack gap={1.5} direction={'row'} alignItems={'center'} position={'relative'}>
      <MessageFeedbackButton
        tooltip={lng(['Хороший ответ', 'Like message'])}
        onClick={handleClick}
        type="like"
        activeType={feedback}
      />
      <MessageFeedbackButton
        tooltip={lng(['Плохой ответ', 'Dislike message'])}
        onClick={handleClick}
        type="dislike"
        activeType={feedback}
      />
      <MessageFeedbackWindow feedback={feedback} />
    </Stack>
  );
}

export default MessageActionFeedback;
