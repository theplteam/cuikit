import { ChatMessage } from './ChatMessage';

export class ChatMessageStreamingModel {
  private _chunks: string[][] = [];

  private _activeTimeout: Promise<void> | undefined;

  private _onCompleteCallback: undefined | (() => void);

  private _timeoutMs = 20;

  constructor(private message: ChatMessage) {}

  push = (textPart: string) => {
    this._chunks.push(textPart.split(' '));
    this._startStreaming();
  }

  faster = () => {
    this._timeoutMs = 10;
  }

  private _startStreaming = async () => {
    if (this._activeTimeout || !this._chunks.length) {
      if (!this._chunks.length) this._onCompleteCallback?.()
      return;
    }

    const part = this._chunks.splice(0, 1)[0];
    this._activeTimeout = this._stream(part);
    await this._activeTimeout;
    this._activeTimeout = undefined;
    this._startStreaming();
  }

  private _stream = (part: string[]) => {
    return new Promise<void>((resolve) => {
      let key = 0;
      // надеемся, что функция будет выполняться быстрее, чем начнется новый цикл :)
      const timeout = setInterval(() => {
        const isLast = part.length - 1 === key;
        // console.log(part[key]);
        this.message.text += part[key] + (isLast ? '' : ' ');

        if (isLast) {
          clearInterval(timeout);
          resolve();
          return;
        }
        key++;
      }, this._timeoutMs);
    });
  }

  onComplete = (callback: undefined | (() => void)) => {
    this._onCompleteCallback = callback;
  }
}
