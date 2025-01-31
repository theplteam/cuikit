import * as React from 'react';
import HiddenContent from '../HiddenContent';
import { MockComponent, MockRequiredComponent } from '../utils/MockComponent';
import { Dialogue } from '../../models/dialogue/Dialogue';
import RootMock from '../message/RootMock';
import { FlattenObject, UnionToIntersection } from '../../types/FlattenObject';
import ListItemText, { ListItemTextProps } from '@mui/material/ListItemText';
import MdButton, { MdButtonProps } from '../../ui/MdButton';
import MdIconButton, { MdIconButtonProps } from '../../ui/MdIconButton';

type SlotValue<T = any> = React.JSXElementConstructor<T>;

type ChatSlotsObjectType<D extends Dialogue> = {
  dialogue: SlotValue;
  list: SlotValue;
  listDriver: SlotValue;
  firstMessage: SlotValue<{ dialogue: D }>;
  popups: {
    sharing: {
      content: SlotValue<{ dialogue: D; tariffsRef: React.RefObject<{ tariffs: number[] }> }>;
    };
    info: {
      content: SlotValue<{ dialogue: D; }>;
    };
  };
};

type ChatCoreSlots = {
  button: SlotValue<MdButtonProps>;
  iconButton: SlotValue<MdIconButtonProps>;
  listItemText: SlotValue<ListItemTextProps>;
};

export type ChatSlotsType<D extends Dialogue> = UnionToIntersection<FlattenObject<ChatSlotsObjectType<D>>> & {
  core: ChatCoreSlots;
};

export const useChatPropsSlots = <D extends Dialogue>(slots?: Partial<ChatSlotsType<D>>, coreSlots?: Partial<ChatCoreSlots>): ChatSlotsType<D> => {
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
