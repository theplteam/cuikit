import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { useChatSlots } from '../../../core/ChatSlotsContext';
import { materialDesignSysPalette } from '../../../../utils/materialDesign/palette';

type Props = {
  type: FeedbackType;
  activeType: FeedbackType | undefined;
  onClick: (type: FeedbackType) => void;
  tooltip?: string;
};

export type FeedbackType = 'like' | 'dislike';

const MessageFeedbackButton: React.FC<Props> = ({ type, activeType, onClick, tooltip }) => {
  const { coreSlots, slots, slotProps } = useChatSlots();

  const isActive = type === activeType;

  const icon = {
    like: {
      active: <slots.messageLikeFilledIcon {...slotProps.messageLikeFilledIcon} />,
      default: <slots.messageLikeOutlinedIcon {...slotProps.messageLikeOutlinedIcon} />,
    },
    dislike: {
      active: <slots.messageDislikeFilledIcon {...slotProps.messageDislikeFilledIcon} />,
      default: <slots.messageDislikeOutlinedIcon {...slotProps.messageDislikeOutlinedIcon} />,
    },
  };

  return (
    <Tooltip title={tooltip}>
      <coreSlots.iconButton
        size='small'
        onClick={() => onClick(type)}
        sx={{
          color: isActive ? materialDesignSysPalette.primary : undefined,
          backgroundColor: isActive ? materialDesignSysPalette.primaryContainer : undefined
        }}
      >
        {icon[type][isActive ? 'active' : 'default']}
      </coreSlots.iconButton>
    </Tooltip>
  );
}

export default MessageFeedbackButton;
