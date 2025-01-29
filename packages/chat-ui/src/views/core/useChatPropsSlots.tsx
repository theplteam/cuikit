import * as React from 'react';
import HiddenContent from '../HiddenContent';
import { MockComponent, MockRequiredComponent } from '../utils/MockComponent';
import { ChatDialogue } from '../../models/ChatDialogue';
import RootMock from '../message/RootMock';
import { FlattenObject, UnionToIntersection } from '../../types/FlattenObject';
import ListItemText, { ListItemTextProps } from '@mui/material/ListItemText';
import MdButton, { MdButtonProps } from '../../ui/MdButton';
import MdIconButton, { MdIconButtonProps } from '../../ui/MdIconButton';

type SlotValue<T = any> = React.JSXElementConstructor<T>;

type ChatSlotsObjectType = {
  dialogue: SlotValue;
  list: SlotValue;
  listDriver: SlotValue;
  firstMessage: SlotValue<{ dialogue: ChatDialogue }>;
  popups: {
    sharing: {
      content: SlotValue<{ dialogue: ChatDialogue; tariffsRef: React.RefObject<{ tariffs: number[] }> }>;
    };
    info: {
      content: SlotValue<{ dialogue: ChatDialogue; }>;
    };
  };
};

type ChatCoreSlots = {
  button: SlotValue<MdButtonProps>;
  iconButton: SlotValue<MdIconButtonProps>;
  listItemText: SlotValue<ListItemTextProps>;
};

export type ChatSlotsType = UnionToIntersection<FlattenObject<ChatSlotsObjectType>> & {
  core: ChatCoreSlots;
};

export const useChatPropsSlots = (slots?: Partial<ChatSlotsType>, coreSlots?: Partial<ChatCoreSlots>): ChatSlotsType => {
  return React.useMemo(() => ({
    firstMessage: slots?.firstMessage ?? MockComponent,
    dialogue: slots?.dialogue ?? RootMock,
    list: slots?.list ?? HiddenContent,
    listDriver: slots?.listDriver ?? React.Fragment,
    popupsSharingContent: slots?.popupsSharingContent ?? MockRequiredComponent('popupsSharingContent'),
    popupsInfoContent: slots?.popupsInfoContent ?? MockRequiredComponent('popupsInfoContent'),

    core: {
      button: coreSlots?.button ?? MdButton,
      iconButton: coreSlots?.iconButton ?? MdIconButton,
      listItemText: coreSlots?.listItemText ?? ListItemText,
    },
  }), [slots]);
}
