import * as React from 'react';
import Stack from '@mui/material/Stack';
import { MessageModel, RatingType } from '../../../../models/MessageModel';
import MessageFeedbackButton from './MessageFeedbackButton';
import MessageFeedbackWindow from './MessageFeedbackWindow';
import { useChatContext } from '../../../../views/core/ChatGlobalContext';
import { useLocalizationContext } from '../../../../views/core/LocalizationContext';
import { useObserverValue } from '../../../../views/hooks/useObserverValue';

type Props = {
  message: MessageModel;
};

const MessageActionFeedback: React.FC<Props> = ({ message }) => {
  const messageRating = useObserverValue(message.rating);
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const ref = React.useRef<HTMLDivElement | null>(null);

  const { onChangeMessageRating, onSendMessageFeedback } = useChatContext();
  const locale = useLocalizationContext();

  const handleActionClick = (action: RatingType) => {
    const newValue = message.rating.value === action ? undefined : action;
    if (newValue && onSendMessageFeedback) setAnchorEl(ref.current);
    onChangeMessageRating?.({ message: message.data, rating: newValue });
    message.rating.value = newValue;
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  return (
    <Stack
      ref={ref} gap={1.5} direction="row"
      alignItems="center" position="relative"
    >
      <MessageFeedbackButton
        tooltip={locale.messageLikeTooltip}
        type="like"
        activeType={messageRating}
        onClick={handleActionClick}
      />
      <MessageFeedbackButton
        tooltip={locale.messageDislikeTooltip}
        type="dislike"
        activeType={messageRating}
        onClick={handleActionClick}
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
