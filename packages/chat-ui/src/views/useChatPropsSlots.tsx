import * as React from 'react';
import HiddenContent from './HiddenContent';
import { MockComponent, MockRequiredComponent } from './utils/MockComponent';
import { ChatDialogue } from '../models/ChatDialogue';
import RootMock from './message/RootMock';
import { FlattenObject, UnionToIntersection } from '../types/FlattenObject';

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

export type ChatSlotsType = UnionToIntersection<FlattenObject<ChatSlotsObjectType>>;

export const useChatPropsSlots = (slots?: Partial<ChatSlotsType>): ChatSlotsType => {
  return React.useMemo(() => ({
    firstMessage: slots?.firstMessage ?? MockComponent,
    dialogue: slots?.dialogue ?? RootMock,
    list: slots?.list ?? HiddenContent,
    listDriver: slots?.listDriver ?? React.Fragment,
    popupsSharingContent: slots?.popupsSharingContent ?? MockRequiredComponent('popupsSharingContent'),
    popupsInfoContent: slots?.popupsInfoContent ?? MockRequiredComponent('popupsInfoContent'),
  }), [slots]);
}
