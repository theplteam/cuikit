import * as React from 'react';
import HiddenContent from '../HiddenContent';
import { MockComponent, MockRequiredComponent } from '../utils/MockComponent';
import { Dialogue } from '../../models/Dialogue';
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

type SlotValue<T = any> = React.JSXElementConstructor<T>;


export type CoreSlots = {
  button: SlotValue<ButtonProps>;
  iconButton: SlotValue<IconButtonProps>;
  listItemText: SlotValue<ListItemTextProps>;
};

export type SlotsType<D extends Dialogue> = { [key in keyof SlotPropsType<D>]: SlotValue<SlotPropsType<D>[key]> } & {
  core: CoreSlots;
};

type SlotsReturnType<D extends Dialogue> = {
  slots: SlotsType<D>;
  slotProps: Partial<SlotPropsType<D>>;
};

export const usePropsSlots = <D extends Dialogue>(
  slots?: Partial<SlotsType<D>>,
  coreSlots?: Partial<CoreSlots>,
  slotProps?: Partial<SlotPropsType<D>>
): SlotsReturnType<D> => {
  return {
    slotProps: React.useMemo(() => slotProps ?? {}, [slotProps]),
    slots: React.useMemo(() => ({
      firstMessage: slots?.firstMessage ?? MockComponent,
      dialogue: slots?.dialogue ?? RootMock,
      list: slots?.list ?? HiddenContent,
      listDriver: slots?.listDriver ?? React.Fragment,
      popupsSharingContent: slots?.popupsSharingContent ?? MockRequiredComponent('popupsSharingContent'),
      popupsInfoContent: slots?.popupsInfoContent ?? MockRequiredComponent('popupsInfoContent'),

      // MARKDOWN
      markdownA: Link,
      markdownTable: ChatMessageTable,
      markdownThead: TableHead,
      markdownTbody: TableBody,
      markdownTh: ChatMessageTableCell,
      markdownTd: ChatMessageTableCell,
      markdownTr: TableRow,
      markdownSpan: Typography,
      markdownUl: ChatMessageUl,
      markdownOl: ChatMessageOl,
      markdownH1: Typography,
      markdownH2: Typography,
      markdownH3: Typography,
      markdownH4: Typography,
      markdownH5: Typography,
      markdownH6: Typography,
      markdownImg: ChatMessageImage,

      // CORE
      core: {
        button: coreSlots?.button ?? Button,
        iconButton: coreSlots?.iconButton ?? IconButton,
        listItemText: coreSlots?.listItemText ?? ListItemText,
      },
    }), [slots])
  };
}
