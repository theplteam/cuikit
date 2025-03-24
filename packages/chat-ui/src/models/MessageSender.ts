import { Message, MessageModel } from './MessageModel';
import { MessageSentParams, StreamResponseState, ThreadHistoryItemType, ThreadModel } from './ThreadModel';

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

  get history() {
    return this.thread.messages.currentMessages.value.map((message) => ({
      role: message.role,
      content: message.content,
    }) as ThreadHistoryItemType)
  }

  setStatus = (status: string) => {
    this.thread.streamStatus.value = status;
  }

  changeTypingStatus = (status: boolean) => {
    if (status !== this.assistantMessage.typing.value) {
      this.assistantMessage.typing.value = status;
    }
  }

  getUserParams = (resolver: (params: { message: Message }) => void): MessageSentParams<DM> => {
    const message = this.assistantMessage;
    return {
      thread: this.thread,
      content: this.content,
      history: this.history,
      message: this.userMessage.data,
      assistantMessage: message.data,
      pushChunk: this.pushChunk,
      setText: this.setText,
      setStatus: this.setStatus,
      onFinish: () => {
        this.changeTypingStatus(false);
        resolver({message: this.userMessage.data});
        message.reasoningManager.updateTimeSec();
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
