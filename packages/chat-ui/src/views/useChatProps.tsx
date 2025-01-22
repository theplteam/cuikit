import * as React from 'react';
import { ChatSlotsType, useChatPropsSlots } from './useChatPropsSlots';
import { ChatDialogue } from '../models/ChatDialogue';
import { ChatModel, ChatModelProps } from '../models/ChatModel';
import { ChatMessage } from '../models/ChatMessage';

type RequiredProps<D extends ChatDialogue> = {
  readonly dialogues: readonly D[];
  dialogue: D;
  setDialogue: (dialogue: D) => void;
};

// используется внутри библиотеки
export type ChatPropsTypes<D extends ChatDialogue = ChatDialogue> = {
  slots: ChatSlotsType,
  loading: boolean;
  modelProps?: ChatModelProps<D>;
  model?: ChatModel<D>;
  assistantActions?: React.JSXElementConstructor<{ message: ChatMessage, dialogue: D }>[];
} & RequiredProps<D>;

// что передает пользователь
export type ChatUsersProps<D extends ChatDialogue> = {
  scrollerRef?: React.RefObject<HTMLDivElement | null>;
  slots?: Partial<ChatSlotsType>;
} & RequiredProps<D> & Partial<Omit<ChatPropsTypes<D>, 'slots' | keyof RequiredProps<D>>>;

export const useChatProps = <D extends ChatDialogue>(userProps: ChatUsersProps<D>): ChatPropsTypes<D> => {
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
