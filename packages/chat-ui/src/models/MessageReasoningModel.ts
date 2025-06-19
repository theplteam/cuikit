import { ObservableReactValue } from '../utils/observers';

type ManagmentValues = ('headers' | 'time' | 'viewType');

export enum ReasoningViewType {
  // The text is not divided into segments. it's a continuous stream of thought
  STREAM = 'stream',
  // The text is divided into segments (headings), similar to ChatGPT.
  SHORT_BLOCKS = 'shortBlocks',
  HEADERS_STREAM = 'headersStream',
}

export class MessageReasoningModel {
  private _reasoningTimeStart = 0;

  readonly title = new ObservableReactValue<string>('');

  readonly text = new ObservableReactValue<string>('');

  readonly timeSec = new ObservableReactValue<number>(0);

  readonly viewType = new ObservableReactValue<ReasoningViewType>(ReasoningViewType.HEADERS_STREAM);

  lockedOptions: ManagmentValues[] = [];

  setUserHeader = (value: string) => {
    if (!this.lockedOptions.includes('headers')) {
      this.lockedOptions.push('headers');
      this.setUserViewType('stream');
    }

    this.title.value = value;
  }

  setUserTimeSec = (value: number) => {
    if (!this.lockedOptions.includes('time')) {
      this.lockedOptions.push('time');
    }

    this.timeSec.value = Math.round(value);
  }

  setUserViewType = (value: 'stream' | 'headlines' | 'headersStream') => {
    if (!this.lockedOptions.includes('viewType')) {
      this.lockedOptions.push('viewType');
    }

    if (this.viewType.value !== value) {
      this.viewType.value = value as ReasoningViewType;
    }
  }

  unlockAutoManagment = (values?: ManagmentValues[]) => {
    if (values) {
      this.lockedOptions = this.lockedOptions.filter(v => !values.includes(v));
    } else {
      this.lockedOptions = [];
    }
  }

  setHeader = (value: string) => {
    if (!this.lockedOptions.includes('headers')) {
      this.title.value = value;
    }
  }

  pushChunk = (chunk: string) => {
    if (!this._reasoningTimeStart) this._reasoningTimeStart = performance.now();
    this.text.value += chunk;
  }

  setText = (reasoning: string) => {
    this.text.value = reasoning;
  }

  updateTimeSec = () => {
    if (!this.lockedOptions.includes('time')) {
      if (this._reasoningTimeStart && !this.timeSec.value) {
        this.timeSec.value = Math.round((performance.now() - this._reasoningTimeStart) / 1000);
      }
    }
  }
}
