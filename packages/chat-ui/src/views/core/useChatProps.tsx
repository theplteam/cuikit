import * as React from 'react';
import { CoreSlots, SlotsType } from './usePropsSlots';
import { DialogueAbstract } from '../../models/DialogueAbstract';
import { ChatModel, ChatModelProps } from '../../models/ChatModel';
import { Message } from '../../models/Message';
import { LangKeys, UserIdType } from '../../models/ChatApp';
import { useLangInit } from './useLangInit';
import { useUserInit } from './useUserInit';
import { SlotPropsType } from './SlotPropsType';
import { ApiRefType } from './useInitializeApiRef';

type RequiredProps<D extends DialogueAbstract> = {
  readonly dialogues: readonly D[];
  dialogue: D | undefined;
  setDialogue: (dialogue: D) => void;
};

// используется внутри библиотеки
export type ChatPropsTypes<D extends DialogueAbstract> = {
  loading: boolean;
  modelProps?: ChatModelProps<D>;
  model?: ChatModel<D>;
  assistantActions?: React.JSXElementConstructor<{ message: Message, dialogue: D }>[];
  userId?: UserIdType;
  proccessAssistantText?: (text: string) => string;
} & RequiredProps<D>;

// что передает пользователь
export type ChatUsersProps<D extends DialogueAbstract> = {
  scrollerRef?: React.RefObject<HTMLDivElement | null>;
  slots?: Partial<Omit<SlotsType<D>, 'core'>>;
  coreSlots?: Partial<CoreSlots>;
  slotProps?: Partial<SlotPropsType<D>>;
  lang?: 'en' | 'ru' | LangKeys;
  apiRef?: React.MutableRefObject<ApiRefType>;
} & RequiredProps<D> & Partial<Omit<ChatPropsTypes<D>, 'slots' | 'coreSlots' | 'slotProps' | keyof RequiredProps<D>>>;

export const useChatProps = <D extends DialogueAbstract> (userProps: ChatUsersProps<D>): ChatPropsTypes<D> => {
  useLangInit(userProps.lang as LangKeys | undefined);
  useUserInit(userProps.userId);

  return React.useMemo(() => ({
    dialogues: userProps.dialogues,
    dialogue: userProps.dialogue,
    setDialogue: userProps.setDialogue,
    loading: userProps.loading ?? false,
    model: userProps.model,
    modelProps: userProps.modelProps,
    assistantActions: userProps.assistantActions,
    proccessAssistantText: userProps.proccessAssistantText,
    // TODO: идея была не обновлять этот объект при изменении некоторых пропсов, мб надо пересмотреть
  }), [userProps.dialogue, userProps.setDialogue, userProps.loading, userProps.dialogues, userProps.proccessAssistantText]);
}
