import { InternalMessageType, Message, MessageModel } from './MessageModel';
import { MessageSentParams, StreamResponseState, ThreadModel } from './ThreadModel';
import { IdType } from '../types';

export class MessageSender<DM extends Message> {
  constructor(
    public readonly content: Message['content'],
    private userMessage: MessageModel<DM>,
    private assistantMessage: MessageModel<DM>,
    private thread: ThreadModel<DM>,
  ) {
  }

  setText = (text: string) => {
    this.changeTypingStatus(true);
    this.assistantMessage.text = text;
  }

  pushChunk = (chunk: string) => {
    if (this.thread.streamStatus.value !== StreamResponseState.TYPING_MESSAGE) {
      this.changeTypingStatus(true);
      this.thread.streamStatus.value = StreamResponseState.TYPING_MESSAGE;
    }
    this.assistantMessage.text += chunk;
  }

  setStatus = (status: string) => {
    this.thread.streamStatus.value = status;
  }

  changeTypingStatus = (status: boolean) => {
    if (status !== this.assistantMessage.typing.value) {
      this.assistantMessage.typing.value = status;
    }
  }

  getUserParams = (
    resolver: (params: { message: InternalMessageType }) => void,
    getInternalMessage: (message: MessageModel) => InternalMessageType,
  ): MessageSentParams => {
    const message = this.assistantMessage;

    const internalUserMessage = getInternalMessage(this.userMessage);
    return {
      updateThreadId: (newId: IdType) => this.thread.data.setId(newId),
      updateUserMessageId: (newId: IdType) => this.userMessage.data.id = newId,
      updateAssistantMessageId: (newId: IdType) => message.data.id = newId,
      content: this.content,
      history: this.thread.messages.currentMessages.value.map(getInternalMessage),
      message: internalUserMessage,
      assistantMessage: getInternalMessage(message),
      pushChunk: this.pushChunk,
      setText: this.setText,
      setStatus: this.setStatus,
      onFinish: () => {
        this.changeTypingStatus(false);
        resolver({ message: internalUserMessage });
        message.reasoningManager.updateTimeSec();
        this.thread.isTyping.value = false;
        message.data.content = message.text;
      },
      reasoning: {
        pushChunk: message.reasoningManager.pushChunk,
        setFull: message.reasoningManager.setText,
        setTitle: message.reasoningManager.setUserHeader,
        setTimeSec: message.reasoningManager.setUserTimeSec,
        setViewType: message.reasoningManager.setUserViewType,
        unlockAutoManagement: message.reasoningManager.unlockAutoManagment,
      },
    }
  }
}
