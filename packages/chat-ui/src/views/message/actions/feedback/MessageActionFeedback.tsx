import * as React from 'react';
import Stack from '@mui/material/Stack';
import { RatingType } from '../../../../models/Message';
import { lng } from '../../../../utils/lng';
import MessageFeedbackButton from './MessageFeedbackButton';
import MessageFeedbackWindow from './MessageFeedbackWindow';
import { useChatContext } from '../../../../views/core/ChatGlobalContext';

type Props = {
  // TODO: #ANY
  message: any;
};

const MessageActionFeedback: React.FC<Props> = ({ message }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const chatContext = useChatContext();

  const handleActionClick = (action: RatingType) => {
    const newValue = message.rating === action ? undefined : action;
    if (newValue) setAnchorEl(ref.current);
    chatContext.onSendRating?.({ message, rating: newValue });
    message.rating = newValue;
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  return (
    <Stack ref={ref} gap={1.5} direction={'row'} alignItems={'center'} position={'relative'}>
      <MessageFeedbackButton
        tooltip={lng(['Хороший ответ', 'Like message'])}
        onClick={handleActionClick}
        type="like"
        activeType={message.rating}
      />
      <MessageFeedbackButton
        tooltip={lng(['Плохой ответ', 'Dislike message'])}
        onClick={handleActionClick}
        type="dislike"
        activeType={message.rating}
      />
      <MessageFeedbackWindow
        message={message}
        anchorEl={anchorEl}
        onClose={handleClose}
      />
    </Stack>
  );
}

export default MessageActionFeedback;
