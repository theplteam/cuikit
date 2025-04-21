import { ObservableReactValue } from '../utils/observers';
import { randomInt } from '../utils/numberUtils/randomInt';

export class MessageText {
  /**
   * Text of message that supports "observation", should you need to update the component immediately upon variable modification, perfect for React.useSyncExternalStore.
   */
  readonly observableText = new ObservableReactValue<string>('');

  readonly modelId: string;

  constructor(text: string) {
    this.text = text;
    this.modelId = 'textModel' + randomInt(100, 10000);
  }

  get text() {
    return this.observableText.value;
  }

  set text(value: string) {
    this.observableText.value = value;
  }
}
