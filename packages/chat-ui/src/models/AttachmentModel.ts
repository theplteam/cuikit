import { ObservableReactValue } from "../utils/observers";
import { Attachment, ChatMessageContentType } from "./MessageModel";
import getVideoPoster from "../utils/getVideoPoster";
import { IdType } from "../types";
import md5 from "md5";
import loadUrlFile from "../utils/loadUrlFile";
import { randomInt } from "../utils/numberUtils/randomInt";

class AttachmentModel {
  readonly progress = new ObservableReactValue<number>(0);

  readonly error = new ObservableReactValue<string | undefined>(undefined);

  readonly poster = new ObservableReactValue<HTMLImageElement | undefined>(undefined);

  readonly isLoading = new ObservableReactValue<boolean>(true);

  private _data: File = new File([''], 'empty');

  private _id: IdType = randomInt(1, 1000);

  public url: string = '';

  public isGallery = false;

  constructor(_fileOrUrl: File | string, _isGallery: boolean, _id?: IdType) {
    this.isGallery = _isGallery;
    this._createSelf(_fileOrUrl, _id);
  }

  get id() { return this._id; }

  get data() { return this._data; }

  get type() { return this._data.type; }

  get name() { return this._data.name; }

  private _createPoster = async () => {
    const img = document.createElement('img');
    if (this.type.startsWith('image')) {
      img.src = this.url;
    }
    if (this.type.startsWith('video')) {
      img.src = await getVideoPoster(this.url);
    }

    img.onload = () => {
      this.poster.value = img;
    };
  }

  setProgress = (n: number) => { this.progress.value = n }

  setError = (e: string) => { this.error.value = e }

  setId = (id: IdType) => { this._id = id }

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
      url: this.url,
    };
    return data;
  }

  private _createSelf = async (fileOrUrl: File | string, id?: IdType) => {
    if (fileOrUrl instanceof File) {
      this._data = fileOrUrl;
      this.url = URL.createObjectURL(this._data);
    } else {
      const file = await loadUrlFile(fileOrUrl)
      if (file) {
        this._data = file;
        this.url = fileOrUrl;
      }
    }

    this._id = id || md5(this.url);
    this.isLoading.value = false;
    this._createPoster();
  };
}

export default AttachmentModel;
