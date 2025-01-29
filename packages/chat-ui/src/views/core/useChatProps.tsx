import * as React from 'react';
import { ChatSlotsType } from './useChatPropsSlots';
import { Dialogue } from 'models/Dialogue';
import { ChatModel, ChatModelProps } from '../../models/ChatModel';
import { Message } from 'models/Message';
import { LangKeys, UserIdType } from '../../models/ChatApp';
import { useLangInit } from './useLangInit';
import { useUserInit } from './useUserInit';
import { DDialogue } from '../../models/DialogueData';

type RequiredProps<Data extends DDialogue = DDialogue> = {
  readonly dialogues: readonly Dialogue<Data>[];
  dialogue: Dialogue<Data> | undefined;
  setDialogue: (dialogue: Dialogue<Data>) => void;
};

// используется внутри библиотеки
export type ChatPropsTypes<Data extends DDialogue = DDialogue> = {
  loading: boolean;
  modelProps?: ChatModelProps<Data>;
  model?: ChatModel<Data>;
  assistantActions?: React.JSXElementConstructor<{ message: Message, dialogue: Dialogue<Data> }>[];
  userId?: UserIdType;
} & RequiredProps<Data>;

// что передает пользователь
export type ChatUsersProps<Data extends DDialogue = DDialogue> = {
  scrollerRef?: React.RefObject<HTMLDivElement | null>;
  slots?: Partial<ChatSlotsType>;
  lang?: 'en' | 'ru' | LangKeys;
} & RequiredProps<Data> & Partial<Omit<ChatPropsTypes<Data>, 'slots' | keyof RequiredProps<Data>>>;

export const useChatProps = <Data extends DDialogue = DDialogue> (userProps: ChatUsersProps<Data>): ChatPropsTypes<Data> => {
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
