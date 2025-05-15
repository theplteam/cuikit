import { ObservableReactValue } from "../utils/observers";
import { randomInt } from "../utils/numberUtils/randomInt";
import { Attachment, ChatMessageContentType } from "./MessageModel";
import { base64FileEncode } from "../utils/base64File";

class MessageAttachmentModel {
  id = randomInt(100, 100000);

  readonly progress = new ObservableReactValue<number>(0);

  readonly poster = new ObservableReactValue<HTMLImageElement | undefined>(undefined);

  private _data: File;

  public url: string;

  constructor(_data: File) {
    this._data = _data;
    this.url = URL.createObjectURL(_data);
    this._createPoster();
  }

  get data() { return this._data; }

  get type() { return this._data.type; }

  get name() { return this._data.name; }

  private _createPoster = async () => {
    const img = document.createElement('img');
    if (this.type.startsWith('image')) {
      img.src = this.url;
    }
    if (this.type.startsWith('video')) {
      const video = document.createElement('video');
      video.src = this.url;
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';
      // Если разрешение больше FullHD грузит минуту, на компьютерах слабее будет дольше
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.currentTime = 0.1; // ускоряет загрузку
        };
        video.onseeked = resolve;
      });
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
      img.src = canvas.toDataURL('image/png');
    }

    if (img.src) this.poster.value = img;
  }

  setProgress = (n: number) => { this.progress.value = n }

  dataToContent = async () => {
    const base64 = await base64FileEncode(this._data)
    const data: Attachment = {
      id: this.id,
      type: this.type.startsWith('image') ? ChatMessageContentType.IMAGE : ChatMessageContentType.FILE,
      base64: base64,
    };
    return data;
  }
}

export default MessageAttachmentModel;
