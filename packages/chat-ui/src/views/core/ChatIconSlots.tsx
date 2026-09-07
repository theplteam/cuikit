import * as React from 'react';
import {
  ArrowUpwardIcon,
  StopIcon,
  ThumbUpAltOutlinedIcon,
  ThumbUpAltIcon,
  ThumbDownOutlinedIcon,
  ThumbDownIcon,
  FormatListBulletedIcon,
} from '../../icons';

type IconSlotValue = React.JSXElementConstructor<any>;

export type ChatIconSlotsType = {
  sendMessageIcon: IconSlotValue;
  stopStreamIcon: IconSlotValue;
  messageLikeOutlinedIcon: IconSlotValue;
  messageLikeFilledIcon: IconSlotValue;
  messageDislikeOutlinedIcon: IconSlotValue;
  messageDislikeFilledIcon: IconSlotValue;
  messageNavIcon: IconSlotValue;
};

export const chatIconSlots: ChatIconSlotsType = {
  sendMessageIcon: ArrowUpwardIcon,
  stopStreamIcon: StopIcon,
  messageLikeOutlinedIcon: ThumbUpAltOutlinedIcon,
  messageLikeFilledIcon: ThumbUpAltIcon,
  messageDislikeOutlinedIcon: ThumbDownOutlinedIcon,
  messageDislikeFilledIcon: ThumbDownIcon,
  messageNavIcon: FormatListBulletedIcon,
};
