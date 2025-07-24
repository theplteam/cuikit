import * as React from 'react';
import { CoreSlots, SlotsType } from './usePropsSlots';
import {
  ChatMessageOwner,
  Message,
  MessageFeedbackTagType,
  MessageModel,
  RatingType
} from '../../models/MessageModel';
import { SlotPropsType } from './SlotPropsType';
import { ApiRefType } from './useApiRef';
import { Thread } from '../../models';
import { ChatEventListeners } from './ChatEventListeners';
import { BeforeUserMessageSendFnType } from '../thread/useThreadSendMessage';
import { GetCurrentBranchFnType } from '../../models/ThreadMessages';
import { MessageSentParams } from '../../models/MessageSentParams';
import { FileAttachedParams } from '../../models/FileAttachedParams';
import { onShowAlertType } from '../../types/onShowAlertType';
import { IdType } from '../../types';
import { ToolType } from '../../types/ToolType';

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
   * You can customize the styles using styled-components or by passing your own classnames.
   */
  className?: string;
  /**
   * Show loading component
   */
  loading: boolean;
  /**
   * This thread will open immediately after chat initialization, if it's in the thread list.
   * If it isn’t in the thread list or if the parameter is not provided, an empty thread will open.
   */
  initialThread?: DD;

  /**
   * Load thread with message history if only id and title are passed in threads
   */
  getFullThread?: (threadId: IdType) => DD | Promise<DD>;

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
  assistantActions?: React.JSXElementConstructor<{ message: Extract<DM, { role: ChatMessageOwner.ASSISTANT }>, thread: DD }>[];
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
   * If callback is set, rating buttons appear. Callback fired when message rating sent
   */
  onChangeMessageRating?: ChatEventListeners<{ message: DM, rating: RatingType | undefined }>;
  /**
   * If callback is set, feedback window appear after rating button click. Callback fired when message feedback sent
   */
  onSendMessageFeedback?: ChatEventListeners<{ message: DM, feedback: string, tags: MessageFeedbackTagType[] }>;
  /**
   * List of "like" options in feedback window.
   * @default messageFeedbackLikeOptions
   */
  feedbackLikeOptions?: MessageFeedbackTagType[];
  /**
   * List of "dislike" options in feedback window.
   * @default messageFeedbackDislikeOptions
   */
  feedbackDislikeOptions?: MessageFeedbackTagType[];
  /**
   * A flag indicating whether message copying is disabled
   */
  disableMessageCopying?: boolean;
  /**
   * Enable chat reasoning functionality
   */
  enableReasoning?: boolean;
  /**
   * List of tools
   */
  toolsList?: ToolType[];
  /**
   * Enable user's ability to add files in messages
   */
  enableFileAttachments?: boolean;
  /**
   * Prevent the user from deleting/adding files during message editing
   */
  disableFileAttachmentsEditing?: boolean;
  /**
   * Callback fired after file attach to message
   */
  onFileAttached?: (params: FileAttachedParams) => void | Promise<void>;
  /**
   * Callback fired after file detached from message
   */
  onFileDetached?: (fileId: IdType) => void | Promise<void>;
  /**
   * Acceptable file formats for attaching to a message.
   * Check [MDN Docs](https://developer.mozilla.org/docs/Web/HTML/Reference/Attributes/accept) for more information.
   * @example Array ['image', 'video'] | ['.png', '.mp4'] | ['image/*', 'video/*']
   * @example String 'image/*, video/*' | '.png, .mp4'
   * @default '*'
   */
  acceptableFileFormat?: string | string[];
  /**
   * Maximum size of a single file in bytes.
   * @default 2 GB
   */
  maxFileSizeBytes?: number;
  /**
   * Maximum number of files in a single message.
   * @default 20
   */
  maxFileCount?: number;
  /**
   * Minimum height of the message container for user + assistant, so that the message from the user appears at the top
   */
  getConversationBlockHeightMin?: (calculatedHeight: number) => number;
  /**
   * The function outputs the first message in the thread.
   */
  initialThreadMessage?: (threadId: IdType) => { text: string, stream: boolean } | undefined;
  /**
   * If this function is present, the default snackbar will not be shown; instead, this function will be called.
   */
  onShowAlert?: onShowAlertType;
  /**
   * Callback fired when active tool changed.
   */
  onToolChanged?: (type: string | undefined) => void;
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
  lang: 'en' | 'ru' | string;
  /**
   * The ref object that allows ChatUI manipulation. Can be instantiated with `useChatContext`
   */
  apiRef: React.MutableRefObject<ApiRefType<DM, DD> | null>;
}> & RequiredProps<DD> & Partial<Omit<ChatPropsTypes<DM, DD>, 'slots' | 'coreSlots' | 'slotProps' | keyof RequiredProps<DD>>>;

export const useChatProps = <DM extends Message, DD extends Thread<DM>>(userProps: ChatUsersProps<DM, DD>): ChatPropsTypes<DM, DD> => {
  const { lang, slotProps, slots, apiRef, coreSlots, scrollerRef, initialThread, threads, ...chatProps } = userProps;

  return React.useMemo(() => ({
    ...chatProps,
    initialThread,
    threads,
    loading: userProps.loading ?? false,
  }), [chatProps, userProps.loading]);
}
