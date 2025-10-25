import { IdType } from '../types';
import { Attachment } from './AttachmentModel';
import { InternalMessageType, Message } from './MessageModel';

export type MessageSentParams<M extends InternalMessageType = InternalMessageType> = {
  /** User's message content */
  content: Message['content'],
  /** User's message attachments */
  attachments: Attachment[],
  /** User's message */
  message: M,
  /** Assistant's message */
  assistantMessage: M,
  /** Thread history */
  history: M[],
  /** Active tool type */
  toolType: string | undefined,
  /** Thread AI model */
  aiModel: string | undefined,
  /**
   *  Pass a part of the received text from the chat (suitable if you are receiving the answer in streaming mode).
   *  Will be added to the current message.
   */
  pushChunk: (chunk: string) => void,
  /** Update text message  */
  setText: (text: string) => void,
  /** Assistant's response answer is complete. */
  onFinish: () => void,
  /** Set awaiting status */
  setStatus: (status: string) => void,
  /** Options for managing reasoning. */
  reasoning: {
    /** Push part of text to the previous text */
    pushChunk: (reasoning: string) => void,
    /** Replace full text */
    setFull: (reasoning: string) => void,
    /**
     * Set the time spent on reasoning.
     * This will lock automatic time managment. To unlock, call the unlock method.
     */
    setTimeSec: (timeSec: number) => void,
    /**
     * Set current reasoning header.
     * This will lock automatic headers. To unlock, call the unlock method.
     */
    setTitle: (title: string) => void,
    /**
     * Set current reasoning header.
     * This will lock automatic headers. To unlock, call the unlock method.
     */
    setViewType: (viewType: 'stream' | 'headlines' | 'headersStream') => void,
    /**
     * Unlock auto managment for locked options (after calling the setHeader, setTimeSec, etc.)
     */
    unlockAutoManagement: (options?: ('headers' | 'time' | 'viewType')[]) => void,
  },
  actions: {
    /** set your thread id */
    updateThreadId: (newId: IdType) => void;
    /** set your thread title */
    updateThreadTitle: (newTitle: string) => void;
    /** set your user's message id */
    updateUserMessageId: (newId: IdType) => void;
    /** set your assistant's message id */
    updateAssistantMessageId: (newId: IdType) => void;
    updateCurrentTextIndex: () => void;
  },
}
