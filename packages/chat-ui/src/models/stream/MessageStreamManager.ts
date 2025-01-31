import { StreamSmootherModel } from './StreamSmootherModel';
import { Message } from '../Message';
import { StreamSmootherAbstract } from './StreamSmootherAbstract';

export type MessageStreamManagerOptions = {
  smoother?: boolean | ((message: Message) => StreamSmootherAbstract);
}

export abstract class MessageStreamManager {
  // дополнительный стрим, чтобы печатание было более плавным, вместо рывков с большими кусками
  readonly smoother: StreamSmootherAbstract | undefined;

  protected _closeConnection?: () => void;

  constructor(
    readonly assistantMessage: Message,
    readonly streamParser: (value: string[], assistantMessage: Message) => void,
    options?: MessageStreamManagerOptions,
  ) {
    if (typeof options?.smoother === 'boolean') {
      if (options.smoother !== false) {
        this.smoother = new StreamSmootherModel((part) => {
          assistantMessage.text += part;
        });
      }
    } else if (options?.smoother) {
      this.smoother = options.smoother(assistantMessage);
    }
  }

  sendMessage = (
    input: string | URL | globalThis.Request,
    init: RequestInit,
  ) => {
    this.assistantMessage.typing.value = true;

    // return new Promise(() => {});
    return new Promise<boolean>((resolve) => {
      this._stream(input, init, resolve);
    });
  }

  close = () => {
    this._closeConnection?.();
  }

  private _stream = (
    input: string | URL | globalThis.Request,
    init: RequestInit,
    onFinish: (result: boolean) => void
  ) => {
    fetch(input, init)
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

                if (jsonStrings) this.streamParser(jsonStrings, this.assistantMessage);

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
      .then(() => onFinish(true));
  }

  pushText = (text: string) => {
    if (this.smoother) {
      this.smoother.pushPartFn(text);
    } else {
      this.assistantMessage.text += text;
    }
  }


}
