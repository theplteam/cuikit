import { ObservableReactValue } from "../utils/observers";
import { Attachment, ChatMessageContentType } from "./MessageModel";
import getVideoPoster from "../utils/getVideoPoster";
import { IdType } from "../types";
import md5 from "md5";

class AttachmentModel {
  readonly progress = new ObservableReactValue<number>(0);

  readonly poster = new ObservableReactValue<HTMLImageElement | undefined>(undefined);

  private _data: File;

  private _id: IdType;

  public url: string;

  constructor(_data: File, _id?: IdType) {
    this._data = _data;
    this.url = URL.createObjectURL(_data);
    this._id = _id || md5(this.url);
 
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
