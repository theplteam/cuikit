import * as React from 'react';
import { CoreSlots, SlotsType } from './usePropsSlots';
import { Dialogue, MessageStreamingParams } from '../../models/Dialogue';
import { DMessage, Message } from '../../models/Message';
import { LangKeys, UserIdType } from '../../models/ChatApp';
import { useLangInit } from './useLangInit';
import { useUserInit } from './useUserInit';
import { SlotPropsType } from './SlotPropsType';
import { ApiRefType } from './useInitializeApiRef';
import { DDialogue } from '../../models';
import { ChatEventListeners } from './ChatEventListeners';
import { FnType } from '../../models/types';

type RequiredProps<DM extends DMessage, DD extends DDialogue<DM>> = {
  /**
   * Dialogues list
   * @required
   */
  dialogues: DD[];
  /**
   * Callback fired when the user sends a message to the dialogue.
   * @param message - User's message
   * @param pushText - call for runtime updating assistant's message
   * @param onFinish - call for finishing
   */
  onUserMessageSent: (params: MessageStreamingParams<DM>) => void;
};

// используется внутри библиотеки
export type ChatPropsTypes<DM extends DMessage, DD extends DDialogue<DM>> = {
  loading: boolean;
  /**
   * This dialogue will open immediately after chat initialization, if it's in the dialogue list.
   * If it isn’t in the dialogue list or if the parameter is not provided, an empty dialogue will open.
   */
  dialogue?: DD;
  /**
   * Action buttons for the assistant's message.
   */
  assistantActions?: React.JSXElementConstructor<{ message: Message<DM>, dialogue: Dialogue<DM, DD> }>[];
  /**
   * Runtime processing of the assistant's message.
   * @param text
   */
  proccessAssistantText?: ((text: string) => string);
  /**
   * Callback fired when the current dialogue changes
   */
  onChangeCurrentDialogue?: ChatEventListeners<{ dialogue: DD }>;
  /**
   * Callback fired when message branch changes
   */
  onChangeMessageBranch?: ChatEventListeners<{ message: DM }>;
  /**
   * Callback fired after message streaming is complete.
   */
  onAssistantMessageTypingFinish?: ChatEventListeners<{ message: DM }>;
  /**
   * Call when user starts new dialogue
   */
  handleCreateNewDialogue?: FnType<DD>;
  /**
   * Invoked when the user clicks the stop streaming button.
   */
  handleStopMessageStreaming?: FnType;
  /**
   * Callback fired when first message sent
   */
  onDialogueCreated?: ChatEventListeners<{ dialogue: DD }>;
  /**
   * Callback fired when first message sent
   */
  onDialogueDeleted?: ChatEventListeners<{ dialogue: DD }>;
} & RequiredProps<DM, DD>;

// что передает пользователь, но не нужно чату
export type ChatUsersProps<DM extends DMessage, DD extends DDialogue<DM>> = Partial<{
  /**
   * ChatUI defaults to using the window for automatic conversation scrolling.
   * if you have embedded the chat within your own component, supply the container's ref to allow for proper scroll management.
   */
  scrollerRef: React.RefObject<HTMLDivElement | null>;
  /**
   * The components used for each slot inside. Can be instantiated with `useChatSlots`
   */
  slots: Partial<Omit<SlotsType<DM, DD>, 'core'>>;
  /**
   * The props used for each slot inside. Can be instantiated with `useChatSlots`
   */
  slotProps: Partial<SlotPropsType<DM, DD>>;
  /**
   * The components used for each core slot include Button, IconButton, etc. Can be instantiated with `useChatSlots` or `useChatCoreSlots`
   */
  coreSlots: Partial<CoreSlots>;
  /**
   * The language in which the chat interface will be displayed.
   */
  lang: 'en' | 'ru' | LangKeys;
  /**
   * The ref object that allows ChatUI manipulation. Can be instantiated with `useChatContext`
   */
  apiRef: React.MutableRefObject<ApiRefType<DM, DD>>;
  userId: UserIdType;
}> & RequiredProps<DM, DD> & Partial<Omit<ChatPropsTypes<DM, DD>, 'slots' | 'coreSlots' | 'slotProps' | keyof RequiredProps<DM, DD>>>;

export const useChatProps = <DM extends DMessage, DD extends DDialogue<DM>> (userProps: ChatUsersProps<DM, DD>): ChatPropsTypes<DM, DD> => {
  const { lang, userId, slotProps, slots, apiRef, coreSlots, scrollerRef, ...chatProps } = userProps;

  useLangInit(userProps.lang as LangKeys | undefined);
  useUserInit(userProps.userId);

  return React.useMemo(() => ({
    ...chatProps,
    loading: userProps.loading ?? false,

    // TODO: идея была не обновлять этот объект при изменении некоторых пропсов, мб надо пересмотреть
  }), [
    userProps.loading,
    userProps.dialogues,
    userProps.proccessAssistantText,
    userProps.assistantActions,
    userProps.onChangeCurrentDialogue,
    userProps.onChangeCurrentDialogue,
  ]);
}
