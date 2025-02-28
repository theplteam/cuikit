import { DMessage, MessageModel } from './MessageModel';
import { MessageSentParams, StreamResponseState, ThreadHistoryItemType, ThreadModel } from './ThreadModel';

export class MessageSender<DM extends DMessage> {
  constructor(
    public readonly content: DMessage['content'],
    private userMessage: MessageModel<DM>,
    private assistantMessage: MessageModel<DM>,
    private thread: ThreadModel<DM>,
  ) {
  }

  private _reasoningTimeStart = 0;

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

  pushReasoningChunk = (chunk: string) => {
    if (!this._reasoningTimeStart) this._reasoningTimeStart = performance.now();
    this.assistantMessage.reasoning.value += chunk;
  }

  setReasoning = (reasoning: string) => {
    this.assistantMessage.reasoning.value = reasoning;
  }

  setReasoningTimeSec = (timeSec: number) => {
    this.assistantMessage.reasoningTimeSec.value = timeSec;
  }

  changeTypingStatus = (status: boolean) => {
    if (status !== this.assistantMessage.typing.value) {
      this.assistantMessage.typing.value = status;
    }
  }

  updateReasoningTime = () => {
    if (this._reasoningTimeStart && !this.assistantMessage.reasoningTimeSec.value) {
      this.assistantMessage.reasoningTimeSec.value = Math.round((performance.now() - this._reasoningTimeStart) / 1000);
    }
  }

  getUserParams = (resolver: (params: { message: DMessage }) => void): MessageSentParams<DM> => {
    return {
      content: this.content,
      history: this.history,
      message: this.userMessage.data,
      pushReasoningChunk: this.pushReasoningChunk,
      pushChunk: this.pushChunk,
      setText: this.setText,
      setReasoning: this.setReasoning,
      setReasoningTimeSec: this.setReasoningTimeSec,
      setStatus: this.setStatus,
      onFinish: () => {
        this.changeTypingStatus(false);
        resolver({message: this.userMessage.data});
        this.updateReasoningTime();
      },
    }
  }
}
