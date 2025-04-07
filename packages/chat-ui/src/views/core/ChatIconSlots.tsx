import * as React from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import StopIcon from '@mui/icons-material/Stop';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

type IconSlotValue = React.JSXElementConstructor<any>;

export type ChatIconSlotsType = {
  sendMessageIcon: IconSlotValue;
  stopStreamIcon: IconSlotValue;
  messageLikeOutlinedIcon: IconSlotValue;
  messageLikeFilledIcon: IconSlotValue;
  messageDislikeOutlinedIcon: IconSlotValue;
  messageDislikeFilledIcon: IconSlotValue;
};

export const chatIconSlots: ChatIconSlotsType = {
  sendMessageIcon: ArrowUpwardIcon,
  stopStreamIcon: StopIcon,
  messageLikeOutlinedIcon: ThumbUpAltOutlinedIcon,
  messageLikeFilledIcon: ThumbUpAltIcon,
  messageDislikeOutlinedIcon: ThumbDownOutlinedIcon,
  messageDislikeFilledIcon: ThumbDownIcon,
};
