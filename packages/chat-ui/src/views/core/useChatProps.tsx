import * as React from 'react';
import { CoreSlots, SlotsType } from './usePropsSlots';
import { Dialogue } from '../../models/Dialogue';
import { ChatModel, ChatModelProps } from '../../models/ChatModel';
import { Message } from '../../models/Message';
import { LangKeys, UserIdType } from '../../models/ChatApp';
import { useLangInit } from './useLangInit';
import { useUserInit } from './useUserInit';
import { SlotPropsType } from './SlotPropsType';
import { ApiRefType } from './useInitializeApiRef';

type RequiredProps<D extends Dialogue> = {
  readonly dialogues: readonly D[];
  dialogue: D | undefined;
  setDialogue: (dialogue: D) => void;
};

// используется внутри библиотеки
export type ChatPropsTypes<D extends Dialogue> = {
  loading: boolean;
  modelProps?: ChatModelProps<D>;
  model?: ChatModel<D>;
  assistantActions?: React.JSXElementConstructor<{ message: Message, dialogue: D }>[];
  userId?: UserIdType;
} & RequiredProps<D>;

// что передает пользователь
export type ChatUsersProps<D extends Dialogue> = {
  scrollerRef?: React.RefObject<HTMLDivElement | null>;
  slots?: Partial<Omit<SlotsType<D>, 'core'>>;
  coreSlots?: Partial<CoreSlots>;
  slotProps?: Partial<SlotPropsType<D>>;
  lang?: 'en' | 'ru' | LangKeys;
  apiRef?: React.MutableRefObject<ApiRefType>;
} & RequiredProps<D> & Partial<Omit<ChatPropsTypes<D>, 'slots' | keyof RequiredProps<D>>>;

export const useChatProps = <D extends Dialogue> (userProps: ChatUsersProps<D>): ChatPropsTypes<D> => {
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
    // TODO: идея была не обновлять этот объект при изменении некоторых пропсов, мб надо пересмотреть
  }), [userProps.dialogue, userProps.setDialogue, userProps.loading, userProps.dialogues]);
}
