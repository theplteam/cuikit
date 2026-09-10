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

export type HistorySlotPropsType = {
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
   * Thread item component
   */
  listItemRoot: React.HTMLAttributes<HTMLDivElement> & { threadId: IdType };
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
  enableDialogueRename: boolean;
  enableThreadPin: boolean;
  onPinThread?: (threadId: IdType, pinnedAt: number | null) => void;
  threadTypeIcons?: Record<string, React.ReactElement>;
  enableVirtualization: boolean;
  itemHeight: number;
  groupHeaderHeight: number;
};

export type HistoryProps = {
  className?: string;
  slots?: Partial<HistorySlotType>;
  slotProps?: Partial<HistorySlotPropsType>;
  threadActions?: React.JSXElementConstructor<{ thread: Thread, onClose: () => void }>[];
  enableDialogueRename?: boolean;
  enableThreadPin?: boolean;
  onPinThread?: (threadId: IdType, pinnedAt: number | null) => void;
  /**
   * Map of thread.type → icon element rendered before the thread title in the list.
   * If a thread has no `type` or the key is missing in the map, no icon is rendered.
   */
  threadTypeIcons?: Record<string, React.ReactElement>;
  /**
   * Renders only the visible window of threads instead of the whole list.
   * Recommended for histories with hundreds of threads or more.
   *
   * Opt-in, because it changes the DOM inside the `threadsList` slot: rows gain
   * a positioning wrapper, off-screen rows are absent from the DOM, and rows are
   * absolutely positioned. CSS that targets the list structurally (child
   * combinators, `:nth-child`) and end-to-end tests that click a thread without
   * scrolling to it first will need updating.
   * @default false
   */
  enableVirtualization?: boolean;
  /**
   * Row height in px, used to position rows without measuring them. Must match
   * the CSS height of `.chat-ui-history-list-item`. Only set this when you
   * override the `threadsList` slot with different row metrics.
   *
   * Ignored unless `enableVirtualization` is set.
   * @default 56
   */
  itemHeight?: number;
  /**
   * Time-group header height in px. Must match the CSS height of
   * `.chat-ui-history-list-item-time-text-wrapper`.
   *
   * Ignored unless `enableVirtualization` is set.
   * @default 40
   */
  groupHeaderHeight?: number;
};
