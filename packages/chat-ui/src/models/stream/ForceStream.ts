import { PromiseUtils } from '../../utils/PromiseUtils';
import { arrayChunk } from '../../utils/arrayUtils/arrayChunk';
import { randomInt } from '../../utils/numberUtils/randomInt';


export class ForceStream {

  private _promise?: PromiseUtils<boolean>;

  // пауза в ms между таймаутами
  speed = { max: 300, min: 100 };

  // пауза в ms между таймаутами
  chunkSize: 'small' | 'medium' | 'large' = 'medium';

  constructor(
    private _text: string,
    private model: { text: string }
  ) {}

  get promise() {
    return this._promise?.promise;
  }

  start = () => {
    const textChunk = this._text.split(' ');

    const rndSize = this.chunkSize === 'small'
      ? { min: 1, max: 4 }
      : this.chunkSize === 'medium'
        ? { min: 2, max: 6 }
        : { min: 4, max: 8 };

    const chunk = arrayChunk(textChunk, () => randomInt(rndSize.min, rndSize.max)).map(v => v.join(' '));

    this._promise = new PromiseUtils();
    this._addTextPart(chunk);
  }

  private _addTextPart = (chunks: string[]) => {
    const part = chunks[0];
    const newChunks = chunks.slice(1);
    this.model.text += `${part} `;
    if (newChunks.length) {
      setTimeout(
        () => this._addTextPart(newChunks),
        randomInt(100, 300),
      )
    } else {
      this._promise?.resolve(true);
    }
  }
}
