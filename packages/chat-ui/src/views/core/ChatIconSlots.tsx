import * as React from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import StopIcon from '@mui/icons-material/Stop';

type IconSlotValue = React.JSXElementConstructor<any>;

export type ChatIconSlotsType = {
  sendMessageIcon: IconSlotValue;
  stopStreamIcon: IconSlotValue;
};

export const chatIconSlots: ChatIconSlotsType = {
  sendMessageIcon: ArrowUpwardIcon,
  stopStreamIcon: StopIcon,
};
