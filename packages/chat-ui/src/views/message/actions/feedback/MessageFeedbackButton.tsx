import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { useChatSlots } from '../../../core/ChatSlotsContext';
import { materialDesignSysPalette } from '../../../../utils/materialDesign/palette';
import { RatingType } from '../../../../models/MessageModel';

type Props = {
  type: RatingType;
  activeType: RatingType | undefined;
  onClick: (type: RatingType) => void;
  tooltip?: string;
};

const MessageFeedbackButton: React.FC<Props> = ({ type, activeType, onClick, tooltip }) => {
  const { coreSlots, slots } = useChatSlots();

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
      <coreSlots.iconButton
        size='small'
        sx={{
          color: isActive ? materialDesignSysPalette.primary : undefined,
          backgroundColor: isActive ? materialDesignSysPalette.primaryContainer : undefined,
          ':hover': { backgroundColor: isActive ? materialDesignSysPalette.primaryFixedDim : undefined },
        }}
        onClick={() => onClick(type)}
      >
        {icon[type][isActive ? 'active' : 'default']}
      </coreSlots.iconButton>
    </Tooltip>
  );
}

export default MessageFeedbackButton;
