import * as React from 'react';
import type { TypographyProps } from '@mui/material/Typography';
import type { IconButtonProps } from '@mui/material/IconButton';
import { Localization } from '../../../locale/Localization';
import { ApiRefType } from '../useApiRef';
import { SlotValue } from '../usePropsSlots';
import { ButtonProps } from '@mui/material/Button';
import { ListItemTextProps } from '@mui/material/ListItemText';
import { MdMenuItemProps } from '../../../ui/menu/MdMenuItem';
import { BoxProps } from '@mui/material/Box';
import { DrawerProps } from '@mui/material/Drawer';
import { StackProps } from '@mui/material/Stack';
import { Thread } from '../../../models/ThreadModel';
import ThreadListModel from './ThreadListModel';

export type ThreadListSlotPropsType = {
  baseMenuItem: MdMenuItemProps;
  baseListItemText: ListItemTextProps;
  baseButton: ButtonProps;
  baseIconButton: IconButtonProps;
  /**
   * History outer container
   */
  historyContainer: BoxProps;
  /**
   * History inner wrapper
   */
  historyWrapper: StackProps;
  /**
   * List of threads
   */
  threadsList: StackProps;
  /**
   * Thread list item wrapper
   */
  threadsListItem: BoxProps;
  /**
   * Driver component for the threads list (mobile version)
   */
  listDrawer: DrawerProps;
  /**
   * Title for the mobile threads list (same as listSubtitle)
   */
  listDrawerTitle: TypographyProps;
    /**
   * Thread menu button in the threads list
   **/
  threadListItemMenuButton: IconButtonProps;
  /**
   * Subtitle component for the list container
   */
  listSubtitle: TypographyProps;
  /**
   * Typography component for rendering time text in the threads list (today, last week, last 30 days, etc.)
   */
  listTimeText: TypographyProps;
  /**
   * listTimeText wrapper
   */
  listTimeTextWrapper: BoxProps;
};

export type ThreadListSlotType = { [key in keyof ThreadListSlotPropsType]: SlotValue<ThreadListSlotPropsType[key]> };

export type ThreadListContextType = {
  threadListModel: ThreadListModel;
  apiRef: React.MutableRefObject<ApiRefType | null>;
  loading: boolean;
  locale: Localization;
  slots: ThreadListSlotType;
  slotProps: Partial<ThreadListSlotPropsType>;
  threadActions: React.JSXElementConstructor<{ thread: Thread, onClose: () => void }>[];
};

export type ThreadListProps = { 
  slots?: Partial<ThreadListSlotType> 
  slotProps?: Partial<ThreadListSlotPropsType>;
  threadActions?: React.JSXElementConstructor<{ thread: Thread, onClose: () => void }>[];
};
