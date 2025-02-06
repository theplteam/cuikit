import { NOOP } from '../utils/NOOP';
import { DialogueAbstract, StreamMessageFnType } from './DialogueAbstract';
import { DDialogue } from './DialogueData';

export class Dialogue extends DialogueAbstract<DDialogue> {
  stopStreaming: () => void

  constructor(
    data: DDialogue,
    public streamMessage: StreamMessageFnType,
    stopStreaming?: () => void,
  ) {
    super(data);
    this.stopStreaming = stopStreaming ?? NOOP;
  }
}
