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
  const { setAppraisal, appraisal } = message;
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleActionClick = (action: FeedbackType) => {
    const newValue = appraisal === action ? undefined : action;
    if (newValue) setAnchorEl(ref.current);
    setAppraisal(newValue);
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
        activeType={appraisal}
      />
      <MessageFeedbackButton
        tooltip={lng(['Плохой ответ', 'Dislike message'])}
        onClick={handleActionClick}
        type="dislike"
        activeType={appraisal}
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
