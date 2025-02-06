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
  /**
   * Dialogues list
   * @required
   */
  readonly dialogues: readonly D[];
  /**
   * Current dialogue
   * @required
   */
  dialogue: D | undefined;
  /**
   * Set current dialogue
   * @required
   * @param dialogue
   */
  setDialogue: (dialogue: D) => void;
};

// используется внутри библиотеки
export type ChatPropsTypes<D extends DialogueAbstract> = {
  loading: boolean;
  /**
   * A model that comprehensively controls dialogues: initiating a new conversation, deleting one, and refining an existing dialogue.
   * You may either provide your own model or retain the standard one.
   */
  model?: ChatModel<D>;
  /**
   * Props for ChatModel. Provide dialogue management functions if you have not designated your own model
   */
  modelProps?: ChatModelProps<D>;
  /**
   * Action buttons for the assistant's message.
   */
  assistantActions?: React.JSXElementConstructor<{ message: Message, dialogue: D }>[];
  userId?: UserIdType;
  /**
   * Runtime processing of the assistant's message.
   * @param text
   */
  proccessAssistantText?: (text: string) => string;
} & RequiredProps<D>;

// что передает пользователь
export type ChatUsersProps<D extends DialogueAbstract> = {
  /**
   * ChatUI defaults to using the window for automatic conversation scrolling.
   * if you have embedded the chat within your own component, supply the container's ref to allow for proper scroll management.
   */
  scrollerRef?: React.RefObject<HTMLDivElement | null>;
  /**
   * The components used for each slot inside. Can be instantiated with `useChatSlots`
   */
  slots?: Partial<Omit<SlotsType<D>, 'core'>>;
  /**
   * The props used for each slot inside. Can be instantiated with `useChatSlots`
   */
  slotProps?: Partial<SlotPropsType<D>>;
  /**
   * The components used for each core slot include Button, IconButton, etc. Can be instantiated with `useChatSlots` or `useChatCoreSlots`
   */
  coreSlots?: Partial<CoreSlots>;
  /**
   * The language in which the chat interface will be displayed.
   */
  lang?: 'en' | 'ru' | LangKeys;
  /**
   * The ref object that allows ChatUI manipulation. Can be instantiated with `useChatContext`
   */
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
