import * as React from 'react';
import HiddenContent from './HiddenContent';
import { MockComponent, MockRequiredComponent } from './utils/MockComponent';
import { ChatDialogue } from '../models/ChatDialogue';
import RootMock from './message/RootMock';

type SlotsKeys = 'dialogue' | 'list' | 'listDriver';

type SlotValue<T = any> = React.JSXElementConstructor<T>;

type PartialRecursive<T> = T extends SlotValue ? T : { [key in keyof T]?: PartialRecursive<T[key]> };

export type ChatSlotsType = Record<SlotsKeys, SlotValue> & {
  firstMessage: SlotValue<{ dialogue: ChatDialogue }>;
  popups: {
    sharing: {
      content: SlotValue<{
        dialogue: ChatDialogue;
        tariffsRef: React.RefObject<{ tariffs: number[] }>
      }>;
    };
    info: {
      content: SlotValue<{
        dialogue: ChatDialogue;
      }>;
    };
  };
};

export const useChatPropsSlots = (slots?: PartialRecursive<ChatSlotsType>): ChatSlotsType => {
  const getValue = React.useCallback((key: SlotsKeys, defaultSlot: SlotValue) => {
    return slots ? slots[key] ?? defaultSlot : defaultSlot;
  }, [slots]);

  return React.useMemo(() => ({
    firstMessage: slots?.firstMessage ?? MockComponent,
    dialogue: getValue('dialogue', RootMock),
    list: getValue('list', HiddenContent),
    listDriver: getValue('listDriver', React.Fragment),
    popups: {
      sharing: {
        content: slots?.popups?.sharing?.content ?? MockRequiredComponent('slots?.popups?.sharing?.content'),
      },
      info: {
        content: slots?.popups?.info?.content ?? MockRequiredComponent('slots?.popups?.info?.content'),
      },
    },
  }), [slots]);
}
