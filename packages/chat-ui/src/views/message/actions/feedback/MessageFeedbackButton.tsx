import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { useChatSlots } from '../../../core/ChatSlotsContext';
import { RatingType } from '../../../../models/MessageModel';

type Props = {
  type: RatingType;
  activeType: RatingType | undefined;
  onClick: (type: RatingType) => void;
  tooltip?: string;
};

const MessageFeedbackButton: React.FC<Props> = ({ type, activeType, onClick, tooltip }) => {
  const { slotProps, slots } = useChatSlots();

  const isActive = type === activeType;

  const icon = {
    like: {
      active: <slots.messageLikeFilledIcon />,
      default: <slots.messageLikeOutlinedIcon />,
    },
    dislike: {
      active: <slots.messageDislikeFilledIcon />,
      default: <slots.messageDislikeOutlinedIcon />,
    },
  };

  return (
    <Tooltip title={tooltip}>
      <slots.messageRatingButton
        size='small'
        sx={{
          color: (theme) => isActive ? theme.palette.text.secondary : undefined,
          backgroundColor: (theme) => isActive ? theme.palette.action.selected : undefined,
          ':hover': { backgroundColor: (theme) => isActive ? theme.palette.action.hover : undefined },
        }}
        onClick={() => onClick(type)}
        {...slotProps.messageRatingButton}
      >
        {icon[type][isActive ? 'active' : 'default']}
      </slots.messageRatingButton>
    </Tooltip>
  );
}

export default MessageFeedbackButton;
