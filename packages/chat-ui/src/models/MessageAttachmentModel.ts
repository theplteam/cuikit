import { ObservableReactValue } from "../utils/observers";
import { randomInt } from "../utils/numberUtils/randomInt";
import { Attachment, ChatMessageContentType } from "./MessageModel";

class MessageAttachmentModel {
  id = randomInt(100, 100000);

  readonly progress = new ObservableReactValue<number>(0);

  private _data: File;

  public url: string;

  constructor(_data: File) {
    this._data = _data;
    this.url = URL.createObjectURL(_data);
  }

  get data() { return this._data; }

  get isImage() { return this._data.type.startsWith('image'); }

  get name() { return this._data.name; }

  dataToContent = () => {
    const data: Attachment = {
      type: this.isImage ? ChatMessageContentType.IMAGE : ChatMessageContentType.FILE,
      url: URL.createObjectURL(this._data),
    };
    return data;
  }

  getImgSize = () => {
    if (!this.isImage) return;
    const image = new Image();
    image.src = this.url;
    return { width: image.width, height: image.height };
  }

  toBase64 = (): Promise<File> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(this._data);
    reader.onload = () => resolve(reader.result as unknown as File);
    reader.onerror = reject;
});
}

export default MessageAttachmentModel;
