import * as React from 'react';
import HiddenContent from '../HiddenContent';
import { MockComponent, MockRequiredComponent } from '../utils/MockComponent';
import RootMock from '../message/RootMock';
import ListItemText, { ListItemTextProps } from '@mui/material/ListItemText';
import Button, { type ButtonProps } from '@mui/material/Button';
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import ChatMessageTable from '../message/markdown/ChatMessageTable';
import ChatMessageTableCell from '../message/markdown/ChatMessageTableCell';
import { ChatMessageOl, ChatMessageUl } from '../message/markdown/ChatMessageUl';
import { SlotPropsType } from './SlotPropsType';
import ChatMessageImage from '../message/markdown/ChatMessageImage';
import MessagePagination from '../message/MessagePagination';
import Stack from '@mui/material/Stack';
import ContainerSubtitle from '../../ui/ContainerSubtitle';
import MessageAssistantProgress from '../message/MessageAssistantProgress';
import MdMenuItem, { MdMenuItemProps } from '../../ui/menu/MdMenuItem';
import ChatMarkdown from '../message/markdown/ChatMarkdown';
import { DDialogue, DMessage } from '../../models';
import { ChatUsersProps } from './useChatProps';
import HelloMessage from '../dialogue/HelloMessage';

type SlotValue<T = any> = React.JSXElementConstructor<T>;


export type CoreSlots = {
  button: SlotValue<ButtonProps>;
  iconButton: SlotValue<IconButtonProps>;
  listItemText: SlotValue<ListItemTextProps>;
  menuItem: SlotValue<MdMenuItemProps>;
};

export type SlotsType<DM extends DMessage, DD extends DDialogue<DM>> = { [key in keyof SlotPropsType<DM, DD>]: SlotValue<SlotPropsType<DM, DD>[key]> };

type SlotsReturnType<DM extends DMessage, DD extends DDialogue<DM>> = {
  slots: SlotsType<DM, DD>;
  coreSlots: CoreSlots;
  slotProps: Partial<SlotPropsType<DM, DD>>;
};
// HelloMessage
export const usePropsSlots = <DM extends DMessage, DD extends DDialogue<DM>>(
  usersProps: ChatUsersProps<DM, DD>
): SlotsReturnType<DM, DD> => {
  const { coreSlots, slots, slotProps, helloMessage } = usersProps;

  const res = React.useMemo(() => {
    const core: CoreSlots = {
      button: coreSlots?.button ?? Button,
      iconButton: coreSlots?.iconButton ?? IconButton,
      listItemText: coreSlots?.listItemText ?? ListItemText,
      menuItem: coreSlots?.menuItem ?? MdMenuItem,
    };

    const componentSlots: SlotsType<DM, DD> = {
      firstMessage: slots?.firstMessage ?? helloMessage
        ? ({ dialogue }) => <HelloMessage text={helloMessage!} dialogue={dialogue} />
        : MockComponent,
      dialogue: slots?.dialogue ?? RootMock,
      list: slots?.list ?? HiddenContent,
      listSubtitle: slots?.listSubtitle ?? ContainerSubtitle,
      listTimeText: slots?.listTimeText ?? Typography,
      listDriver: slots?.listDriver ?? React.Fragment,
      listDriverTitle: slots?.listDriverTitle ?? Typography,
      popupsSharingContent: slots?.popupsSharingContent ?? MockRequiredComponent('popupsSharingContent'),
      popupsInfoContent: slots?.popupsInfoContent ?? MockRequiredComponent('popupsInfoContent'),

      // MARKDOWN
      markdown: slots?.markdown ?? ChatMarkdown,
      markdownA: slots?.markdownA ?? Link,
      markdownTable: slots?.markdownTable ?? ChatMessageTable,
      markdownThead: slots?.markdownThead ?? TableHead,
      markdownTbody: slots?.markdownTbody ?? TableBody,
      markdownTh: slots?.markdownTh ?? ChatMessageTableCell,
      markdownTd: slots?.markdownTd ?? ChatMessageTableCell,
      markdownTdText: slots?.markdownTdText ?? Typography,
      markdownTr: slots?.markdownTr ?? TableRow,
      markdownSpan: slots?.markdownSpan ?? Typography,
      markdownUl: slots?.markdownUl ?? ChatMessageUl,
      markdownOl: slots?.markdownOl ?? ChatMessageOl,
      markdownH1: slots?.markdownH1 ?? Typography,
      markdownH2: slots?.markdownH2 ?? Typography,
      markdownH3: slots?.markdownH3 ?? Typography,
      markdownH4: slots?.markdownH4 ?? Typography,
      markdownH5: slots?.markdownH5 ?? Typography,
      markdownH6: slots?.markdownH6 ?? Typography,
      markdownImg: slots?.markdownImg ?? ChatMessageImage,
      markdownP: slots?.markdownP ?? Typography,
      messagePagination: slots?.messagePagination ?? MessagePagination,
      messagePaginationRoot: slots?.messagePaginationRoot ?? Stack,
      messagePaginationButton: slots?.messagePaginationButton ?? core.iconButton,
      messagePaginationText: slots?.messagePaginationText ?? Typography,
      messageAssistantFooter: slots?.messageAssistantFooter ?? MockComponent,
      messageAssistantProgress: slots?.messageAssistantProgress ?? MessageAssistantProgress,
      messageAssistantProgressText: slots?.messageAssistantProgressText ?? Typography,
    }

    return {
      slots: componentSlots,
      coreSlots: core,
    };
  }, [slots]);

  return {
    slotProps: React.useMemo(() => slotProps ?? {}, [slotProps]),
    slots: res.slots,
    coreSlots: res.coreSlots
  };
}
