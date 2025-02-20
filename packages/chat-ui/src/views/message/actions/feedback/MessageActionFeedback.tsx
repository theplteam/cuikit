import * as React from 'react';
import Stack from '@mui/material/Stack';
import { Message, RatingType } from '../../../../models/Message';
import MessageFeedbackButton from './MessageFeedbackButton';
import MessageFeedbackWindow from './MessageFeedbackWindow';
import { useChatContext } from '../../../../views/core/ChatGlobalContext';
import { useLocalizationContext } from '../../../../views/core/LocalizationContext';

type Props = {
  message: Message;
};

const MessageActionFeedback: React.FC<Props> = ({ message }) => {
  const [activeType, setActiveType] = React.useState(message.rating);
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const ref = React.useRef<HTMLDivElement | null>(null);

  const { onSendRating, onSendFeedback } = useChatContext();
  const locale = useLocalizationContext();

  const handleActionClick = (action: RatingType) => {
    const newValue = message.rating === action ? undefined : action;
    if (newValue && onSendFeedback) setAnchorEl(ref.current);
    onSendRating?.({ message: message.data, rating: newValue });
    setActiveType(newValue);
    message.rating = newValue;
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  return (
    <Stack ref={ref} gap={1.5} direction={'row'} alignItems={'center'} position={'relative'}>
      <MessageFeedbackButton
        tooltip={locale.messageLikeTooltip}
        onClick={handleActionClick}
        type="like"
        activeType={activeType}
      />
      <MessageFeedbackButton
        tooltip={locale.messageDislikeTooltip}
        onClick={handleActionClick}
        type="dislike"
        activeType={activeType}
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
