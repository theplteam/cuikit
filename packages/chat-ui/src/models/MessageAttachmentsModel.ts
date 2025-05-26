import AttachmentModel from "./AttachmentModel";
import { Attachment } from "./MessageModel";
import loadUrlFile from "../utils/loadUrlFile";
import { ObservableReactValue } from "../utils/observers/ObservableReactValue";
import { IdType } from "../types";
import attachmentsStore from "./AttachmentsStore";

class MessageAttachmentsModel {
  readonly deletedIds = new ObservableReactValue<IdType[]>([]);

  public itemsAll: AttachmentModel[] = [];

  init = async (attachments: Attachment[]) => {  
    for (const attachment of attachments) {
      const cacheItem = attachmentsStore.items.find((i) => i.id === attachment.id);
      if (cacheItem) {
        this.itemsAll.push(cacheItem);
        attachmentsStore.items = attachmentsStore.items.filter((a) => a.id !== attachment.id);
        continue;
      }
  
      const file = attachment.file || await this._loadFile(attachment.url || '');
      if (file) {
        const model = new AttachmentModel(file, attachment.id);
        this.itemsAll.push(model);
      }
    }
  }

  get editorItems() { return this.itemsAll.filter((i) => !this.deletedIds.value.includes(i.id)); }

  get galleryItems() { return this.editorItems.filter((i) => i.isGallery); }

  get fileItems() { return this.editorItems.filter((i) => !i.isGallery); }

  private _loadFile = async (url: string) => {
    const file = await loadUrlFile(url)
    return file;
  };
}

export default MessageAttachmentsModel;
