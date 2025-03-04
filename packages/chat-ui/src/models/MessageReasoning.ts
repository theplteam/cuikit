import { ObservableReactValue } from '../utils/observers';

type ManagmentValues = ('headers' | 'time');

export class MessageReasoning {
  private _reasoningTimeStart = 0;

  readonly title = new ObservableReactValue<string>('');
  readonly text = new ObservableReactValue<string>('');
  readonly timeSec = new ObservableReactValue<number>(0);

  lockedOptions: ManagmentValues[] = [];

  setUserHeader = (value: string) => {
    if (!this.lockedOptions.includes('headers')) {
      this.lockedOptions.push('headers');
    }

    this.title.value = value;
  }

  setUserTimeSec = (value: number) => {
    if (!this.lockedOptions.includes('time')) {
      this.lockedOptions.push('time');
    }

    this.timeSec.value = value;
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
