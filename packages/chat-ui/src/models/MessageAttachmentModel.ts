import { ObservableReactValue } from "../utils/observers";
import { randomInt } from "../utils/numberUtils/randomInt";
import { Attachment, ChatMessageContentType } from "./MessageModel";

class MessageAttachmentModel {
  id = randomInt(100, 100000);

  readonly progress = new ObservableReactValue<number>(0);

  private _data: File;

  public url: string;

  constructor(_data: File, _isLoaded?: boolean) {
    this._data = _data;
    this.url = URL.createObjectURL(_data);

    if (_isLoaded) this.progress.value = 100;
  }

  get data() { return this._data; }

  get isImage() { return this._data.type.startsWith('image'); }

  get name() { return this._data.name; }

  setProgress = (n: number) => { this.progress.value = n }

  dataToContent = async () => {
    const base64 = await this.toBase64()
    const data: Attachment = {
      type: this.isImage ? ChatMessageContentType.IMAGE : ChatMessageContentType.FILE,
      base64: base64,
    };
    return data;
  }

  getImgSize = () => {
    if (!this.isImage) return;
    const image = new Image();
    image.src = this.url;
    return { width: image.width, height: image.height };
  }

  toBase64 = () => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        const base64 = result.split(',')[1] || result;
        resolve(base64);
      }
    };
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(this._data);
  });
}

export default MessageAttachmentModel;
