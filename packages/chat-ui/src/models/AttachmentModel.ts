import { ObservableReactValue } from "../utils/observers";
import { randomInt } from "../utils/numberUtils/randomInt";
import { Attachment, ChatMessageContentType } from "./MessageModel";
import getVideoPoster from "../utils/getVideoPoster";
import { IdType } from "../types";

class AttachmentModel {
  readonly progress = new ObservableReactValue<number>(0);

  readonly poster = new ObservableReactValue<HTMLImageElement | undefined>(undefined);

  private _data: File;

  private _id: IdType =  randomInt(100, 100000);

  public url: string;

  constructor(_data: File, _id?: IdType) {
    if (_id) {
      this.progress.value = 100;
      this._id = _id;
    }
  
    this._data = _data;
    this.url = URL.createObjectURL(_data);
 
    this._createPoster();
  }

  get id() { return this._id; }

  get data() { return this._data; }

  get type() { return this._data.type; }

  get name() { return this._data.name; }

  get isGallery() {
    return this.type.startsWith('image') || this.type.startsWith('video');
  }

  private _createPoster = async () => {
    const img = document.createElement('img');
    if (this.type.startsWith('image')) {
      img.src = this.url;
    }
    if (this.type.startsWith('video')) {
      img.src = await getVideoPoster(this.url);
    }

    if (img.src) this.poster.value = img;
  }

  setProgress = (n: number) => { this.progress.value = n }

  get contentData() { 
    const type = this.type.startsWith('image')
      ? ChatMessageContentType.IMAGE
      : this.type.startsWith('video')
        ? ChatMessageContentType.VIDEO
        : ChatMessageContentType.FILE;
    const data: Attachment = {
      id: this.id,
      type,
      file: this._data,
    };
    return data;
  }
}

export default AttachmentModel;
