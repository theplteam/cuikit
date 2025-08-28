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
import { IdType } from '../../../types';
import { InternalApiType } from './internalApi';
import { AIModelType } from '../../../types/AIModelType';
import { ListItemButtonProps } from '@mui/material/ListItemButton';

export type HistorySlotPropsType = {
  baseMenuItem: MdMenuItemProps;
  baseListItemText: ListItemTextProps;
  baseListItemButton: ListItemButtonProps;
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
   * Drawer component (mobile version)
   */
  listDrawer: DrawerProps;
  /**
   * Title for the listDrawer (same as listSubtitle)
   */
  listDrawerTitle: TypographyProps;
    /**
   * Thread menu button
   **/
  threadListItemMenuButton: IconButtonProps & { threadId: IdType };
  /**
   * Subtitle component for the list container
   */
  listSubtitle: TypographyProps;
  /**
   * Typography component for rendering time text (today, last week, last 30 days, etc.)
   */
  listTimeText: TypographyProps;
  /**
   * listTimeText wrapper
   */
  listTimeTextWrapper: React.HTMLAttributes<HTMLDivElement>;
  /**
   * button component in AI model select
   */
  aiModelButton: ButtonProps;
};

export type HistorySlotType = { [key in keyof HistorySlotPropsType]: SlotValue<HistorySlotPropsType[key]> };

export type HistoryContextType = {
  internal: InternalApiType | undefined;
  apiRef: React.MutableRefObject<ApiRefType | null>;
  loading: boolean;
  locale: Localization;
  slots: HistorySlotType;
  slotProps: Partial<HistorySlotPropsType>;
  threadActions: React.JSXElementConstructor<{ thread: Thread, onClose: () => void }>[];
  aiModelList: AIModelType[];
  openNewThreadOnModelChange: boolean;
};

export type HistoryProps = {
  className?: string;
  slots?: Partial<HistorySlotType> ;
  slotProps?: Partial<HistorySlotPropsType>;
  threadActions?: React.JSXElementConstructor<{ thread: Thread, onClose: () => void }>[];
  aiModelList?: AIModelType[];
  openNewThreadOnModelChange?: boolean;
};
