import * as React from 'react';
import { ChatSlotsType, useChatPropsSlots } from './useChatPropsSlots';
import { ChatDialogue } from '../models/ChatDialogue';
import { ChatModel, ChatModelProps } from '../models/ChatModel';

type RequiredProps = {
  readonly dialogues: readonly ChatDialogue[];
  dialogue: ChatDialogue;
  setDialogue: (dialogue: ChatDialogue) => void;
  model?: ChatModel;
};

export type ChatPropsTypes = {
  slots: ChatSlotsType,
  loading: boolean;
  modelProps?: ChatModelProps;
} & RequiredProps;

export type ChatUsersProps = {
  scrollerRef?: React.RefObject<HTMLDivElement | null>;
} & RequiredProps & { [key in keyof Omit<ChatPropsTypes, keyof RequiredProps>]?: Partial<ChatPropsTypes[key]> };

export const useChatProps = (userProps: ChatUsersProps): ChatPropsTypes => {
  const slots = useChatPropsSlots(userProps.slots);

  return React.useMemo(() => ({
    slots,
    dialogues: userProps.dialogues,
    dialogue: userProps.dialogue,
    setDialogue: userProps.setDialogue,
    loading: userProps.loading ?? false,
    model: userProps.model,
    modelProps: userProps.modelProps,
  }), [slots, userProps.dialogue, userProps.setDialogue, userProps.loading, userProps.dialogues]);
}
