import * as React from 'react';
import { ChatSlotsType, useChatPropsSlots } from './useChatPropsSlots';
import { ChatDialogue } from '../models/ChatDialogue';
import { ChatModel, ChatModelProps } from '../models/ChatModel';

type RequiredProps = {
  readonly dialogues: readonly ChatDialogue[];
  dialogue: ChatDialogue;
  setDialogue: (dialogue: ChatDialogue) => void;
};

// используется внутри библиотеки
export type ChatPropsTypes = {
  slots: ChatSlotsType,
  loading: boolean;
  modelProps?: ChatModelProps;
  model?: ChatModel;
  assistantActions?: React.ReactElement[];
} & RequiredProps;

// что передает пользователь
export type ChatUsersProps = {
  scrollerRef?: React.RefObject<HTMLDivElement | null>;
  slots?: Partial<ChatSlotsType>;
} & RequiredProps & Partial<Omit<ChatPropsTypes, 'slots' | keyof RequiredProps>>;

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
    assistantActions: userProps.assistantActions,
    // TODO: идея была не обновлять этот объект при изменении некоторых пропсов, мб надо пересмотреть
  }), [slots, userProps.dialogue, userProps.setDialogue, userProps.loading, userProps.dialogues]);
}
