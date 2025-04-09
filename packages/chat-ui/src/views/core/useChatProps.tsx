import * as React from 'react';
import { CoreSlots, SlotsType } from './usePropsSlots';
import {
  ChatMessageOwner,
  Message,
  MessageModel,
  RatingType
} from '../../models/MessageModel';
import { LangKeys, UserIdType } from '../../models/ChatApp';
import { useLangInit } from './useLangInit';
import { useUserInit } from './useUserInit';
import { SlotPropsType } from './SlotPropsType';
import { ApiRefType } from './useApiRef';
import { Thread } from '../../models';
import { ChatEventListeners } from './ChatEventListeners';
import { BeforeUserMessageSendFnType } from '../thread/useThreadSendMessage';
import { GetCurrentBranchFnType } from '../../models/ThreadMessages';
import { MessageSentParams } from '../../models/MessageSentParams';

type RequiredProps<DD extends Thread<any>> = {
  /**
   * Threads list
   * @required
   */
  threads: DD[];
  /**
   * Callback fired when the user sends a message to the thread.
   * @param message - User's message
   */
  onUserMessageSent: (params: MessageSentParams) => void | Promise<void>;
};

// используется внутри библиотеки
export type ChatPropsTypes<DM extends Message, DD extends Thread<DM>> = {
  /**
   * Show loading component
   */
  loading: boolean;
  /**
   * This thread will open immediately after chat initialization, if it's in the thread list.
   * If it isn’t in the thread list or if the parameter is not provided, an empty thread will open.
   */
  thread?: DD;

  /**
   * Advanced function for forming a sequence of messages to implement custom functionality of branches
   */
  getCurrentBranch?: GetCurrentBranchFnType;

  /**
   * You can create your own messages from the user and assistant before sending, according to your architecture,
   * after which the Chat UI will adjust them to its format via an Adapter.
   */
  beforeUserMessageSend?: BeforeUserMessageSendFnType;

  /**
   * Action buttons for the assistant's message.
   */
  assistantActions?: React.JSXElementConstructor<{ message: Extract<DM, { role: ChatMessageOwner.ASSISTANT }>, thread: Thread<DM> }>[];
  /**
   * Action buttons for the thread's list item menu.
   */
  threadActions?: React.JSXElementConstructor<{ thread: DD, onClose: () => void }>[];
  /**
   * Runtime processing of the assistant's message.
   * @param text
   */
  processAssistantText?: ((text: string) => string);
  /**
   * Callback fired when the current thread changes
   */
  onChangeCurrentThread?: ChatEventListeners<{ thread: DD }>;
  /**
   * Callback fired when message branch changes
   */
  onChangeMessageBranch?: ChatEventListeners<{ message: DM }>;
  /**
   * Callback fired after message streaming is complete.
   */
  onAssistantMessageTypingFinish?: ChatEventListeners<{ message: DM, thread: DD }>;
  /**
   * Call when user starts new thread
   */
  handleCreateNewThread?: () => DD;
  /**
   * Invoked when the user clicks the stop streaming button.
   */
  handleStopMessageStreaming?: () => void;
  /**
   * This function defines pagination for the branching point of the chat.
   */
  handleBranchPagination?: (currentMessage: MessageModel<DM>, messages: MessageModel<DM>[]) => MessageModel<DM>[];
  /**
   * Callback fired when first message sent
   */
  onFirstMessageSent?: ChatEventListeners<{ thread: DD }>;
  /**
   * Callback fired when first message sent
   */
  onThreadDeleted?: ChatEventListeners<{ thread: DD }>;
  /**
   * Prefill textfield
   */
  defaultTextFieldValue?: string;
  /**
   * Branching of the conversation after editing the user's message or updating the assistant's answer.
   * Unlocks the "edit message" function for the user.
   * Unlocks the "change model" or "reply again" function for the assistant.
   */
  enableBranches?: boolean;
  /**
   * Callback fired when message rating sent
   */
  onSendRating?: ChatEventListeners<{ message: DM, rating: RatingType | undefined }>;
  /**
   * Callback fired when message feedback sent
   */
  onSendFeedback?: ChatEventListeners<{ message: DM, feedback: string, tags: string[] }>;
  /**
   * A flag indicating whether message copying is disabled
   */
  disableMessageCopying?: boolean;
  /**
   * Enable chat reasoning functionality
   */
  enableReasoning?: boolean;
  /**
   * Enable user's ability to add pictures in messages
   */
  enableImageAttachments?: boolean;
} & RequiredProps<DD>;

// что передает пользователь, но не нужно чату
export type ChatUsersProps<DM extends Message, DD extends Thread<DM>> = Partial<{
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
  apiRef: React.MutableRefObject<ApiRefType<DM, DD> | null>;
  /**
   * Show a welcome message at the beginning of the thread.
   */
  helloMessage?: string
  userId: UserIdType;
}> & RequiredProps<DD> & Partial<Omit<ChatPropsTypes<DM, DD>, 'slots' | 'coreSlots' | 'slotProps' | keyof RequiredProps<DD>>>;

export const useChatProps = <DM extends Message, DD extends Thread<DM>>(userProps: ChatUsersProps<DM, DD>): ChatPropsTypes<DM, DD> => {
  const { lang, userId, slotProps, slots, apiRef, coreSlots, scrollerRef, thread, threads, ...chatProps } = userProps;

  useLangInit(userProps.lang as LangKeys | undefined);
  useUserInit(userProps.userId);

  return React.useMemo(() => ({
    ...chatProps,
    thread,
    threads,
    loading: userProps.loading ?? false,
  }), [chatProps, userProps.loading]);
}
