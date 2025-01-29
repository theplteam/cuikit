import { Message, StreamResponseState } from 'models/Message';
import { Dialogue } from 'models/Dialogue';
import { ChatMessageStreamingModel } from './ChatMessageStreamingModel';
import { DDialogue } from './DialogueData';
import { ChatApp } from './ChatApp';

enum StreamResponseKeys {
  INIT = 'init',
  MESSAGE = 'message',
  STATE = 'state',
  ERROR = 'error',
  FINAL = 'final',
  INFO = 'info',
  ACTIONS = 'actions',
}

type StreamResponse = {
  type: StreamResponseKeys.MESSAGE;
  content: string;
} | {
  type: StreamResponseKeys.INIT,
  content: {
  },
} | {
  type: StreamResponseKeys.STATE,
  content: {
    state: StreamResponseState;
  },
} | {
  type: StreamResponseKeys.ACTIONS,
  content: string[],
} | {
  type: StreamResponseKeys.ERROR,
  content: {
    error: string;
    code: number;
  },
} | {
  type: StreamResponseKeys.FINAL | StreamResponseKeys.INFO,
  content: {
    dialogue: DDialogue;
    // TODO #ANY
    limits: any;
    messageId: string;
    answerId: string;
    info: string;
  },
};

export class ChatSendMessage {
  private _error = false;

  // дополнительный стрим, чтобы печатание было более плавным, вместо рывков с большими кусками
  private _streamingModel: ChatMessageStreamingModel;

  private _closeConnection?: () => void;

  constructor(
    private dialogue: Dialogue,
    private userMessage: Message,
    private assistantMessage: Message,
  ) {
    this._streamingModel = new ChatMessageStreamingModel(assistantMessage);
  }

  sendMessage = (url: string, authCode: string, data: object) => {
    this.assistantMessage.typing.value = true;

    // return new Promise(() => {});
    return new Promise<boolean>((resolve) => {
      this._stream(url, authCode, data, resolve);
    });
  }

  close = () => {
    this._closeConnection?.();
  }

  private _stream = (url: string, authCode: string, data: object, onFinish: (status: boolean) => void) => {
    const ctrl = new AbortController();

    const assistant = this.assistantMessage;

    assistant.streamState.value = StreamResponseState.START;
    // assistant.streamCurrentHeader = undefined;

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'text/event-stream',
        Authorization: `Bearer ${authCode}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data, lang: ChatApp.lang }),
      signal: ctrl.signal,
    })
      .then((response) => response.body)
      .then((rb) => {
        if (!rb) return null;
        const reader = rb.getReader();

        return new ReadableStream({
          start: (controller) => {
            // The following function handles each data chunk
            const push = () => {
              // "done" is a Boolean and value a "Uint8Array"
              reader.read().then(({ done, value }) => {

                // If there is no more data to read
                if (done) {
                  // console.log("done", done);
                  controller.close();
                  return;
                }
                // Get the data and send it to the browser via the controller
                controller.enqueue(value);
                // Check chunks by logging to the console
                let string = new TextDecoder().decode(value);

                const jsonStrings = string.match(/data: (.*)/g);

                if (jsonStrings) {
                  this.parseStreamResult(jsonStrings, 0);
                }

                push();
              });
            }

            push();
          },
        });
      })
      .then((stream) =>
        // Respond with our stream
        new Response(stream, { headers: { "Content-Type": "text/html" } }).text(),
      )
      .then(() => {
        /*const jsonStrings = result.match(/data: (.*)/g);
        requestAnimationFrame(() => {
          // перезаписываем на итоговый результат в конце на случай, если что-то пошло криво во время стрима
          if (jsonStrings) {
            this.parseStreamResult(jsonStrings, 0, true);
          }
        });*/

        onFinish(true);
      });

    this._closeConnection = () => {
      ctrl.abort('stop');
      onFinish(true);
      assistant.streamState.value = undefined;
    };
  }

  private parseStreamResult = (chunkArray: string[], startFrom: number, clearMessage = false) => {
    if (this._error) return;
    const contentLength = chunkArray.length;
      if (clearMessage) {
        this.assistantMessage.text = '';
      }
      for (let i = startFrom; i < contentLength; i++) {
        let chunk = chunkArray[i];
        if (!chunk) break;
        const replaceNewLineValue = '\r\n\n';
        if (chunk.substring(0, replaceNewLineValue.length) === replaceNewLineValue) {
          chunk = chunk.substring(replaceNewLineValue.length);
        } else {
          chunk = chunk.substring('data: '.length);
        }

        const jsonObject: StreamResponse = JSON.parse(chunk);
        const assistant = this.assistantMessage;

        if (jsonObject.type === StreamResponseKeys.MESSAGE) {
          if (assistant.streamState.value !== StreamResponseState.TYPING_MESSAGE) {
            assistant.streamState.value = StreamResponseState.TYPING_MESSAGE;
          }

          this._streamingModel.push(jsonObject.content);
        }

        if (jsonObject.type === StreamResponseKeys.ERROR) {
          // ResultSnackBar.error(jsonObject.content.error);
          this._error = true;
          this.assistantMessage.onError(jsonObject.content.code);
        }

        /*if (jsonObject.type === StreamResponseKeys.ACTIONS) {
          assistant.setStreamHeaders(jsonObject.content);
        }*/

        if (jsonObject.type === StreamResponseKeys.STATE) {
          const state = jsonObject.content.state;
          assistant.streamState.value = state;

          if (state === StreamResponseState.FINISH_MESSAGE) {
            this._streamingModel.onComplete(() => assistant.typing.value = false);
          }
        }

        if (jsonObject.type === StreamResponseKeys.INFO) {
          const { messageId } = jsonObject.content;
          if (messageId) {
            this.userMessage.setId(messageId);
            this.assistantMessage.parentId = messageId;
          }
        }

        if (jsonObject.type === StreamResponseKeys.FINAL) {
          // серверный стрим уже закончился, ускоряем локальный
          this._streamingModel.faster();
          const { answerId, dialogue, info } = jsonObject.content;
          // appModel.chat.limits = limits;
          // this.dialogue.data.tokensUsage  = dialogue.usage ?? 0;
          this.dialogue.data.title  = dialogue.title;
          // генерируем в клиенте
          // this.userMessage.setId(messageId);
          assistant.setId(answerId);
          assistant.messageFilters = info;
        }
      }
  }
}
