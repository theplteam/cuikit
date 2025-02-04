import { NOOP } from '../utils/NOOP';
import { DialogueAbstract, StreamMessageFnType } from './DialogueAbstract';
import { DDialogue } from './DialogueData';

export class Dialogue<Data extends DDialogue> extends DialogueAbstract<Data> {
  stopStreaming: () => void

  constructor(
    data: Data,
    public streamMessage: StreamMessageFnType,
    stopStreaming?: () => void,
  ) {
    super(data);
    this.stopStreaming = stopStreaming ?? NOOP;
  }
}
