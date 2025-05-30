import AttachmentModel from "./AttachmentModel";
import { Attachment, ChatMessageContentType } from "./MessageModel";
import loadUrlFile from "../utils/loadUrlFile";
import { ObservableReactValue } from "../utils/observers/ObservableReactValue";
import { IdType } from "../types";
import attachmentsStore from "./AttachmentsStore";

class MessageAttachmentsModel {
  readonly deletedIds = new ObservableReactValue<IdType[]>([]);

  readonly itemsAll = new ObservableReactValue<AttachmentModel[]>([]);

  readonly loadingGalleryCount = new ObservableReactValue<number>(0);

  readonly loadingFileCount = new ObservableReactValue<number>(0);

  init = async (attachments: Attachment[]) => {
    const buffer: AttachmentModel[] = [];
    attachments.forEach((a) => {
      if (a.type === ChatMessageContentType.FILE) {
        this.loadingFileCount.value += 1;
      } else {
        this.loadingGalleryCount.value += 1;
      }
    });

    for (const attachment of attachments) {
      const cacheItem = attachmentsStore.items.find((i) => i.id === attachment.id);
      if (cacheItem) {
        buffer.push(cacheItem);
        attachmentsStore.items = attachmentsStore.items.filter((a) => a.id !== attachment.id);
        continue;
      }

      const file = attachment.file ? attachment.file : await this._loadFile(attachment.url || '');
      if (file) {
        const model = new AttachmentModel(file, attachment.id);
        buffer.push(model);
      }
    }
    this.loadingFileCount.value = this.loadingGalleryCount.value = 0;
    this.itemsAll.value = buffer;
  }

  private _loadFile = async (url: string) => {
    const file = await loadUrlFile(url)
    return file;
  };
}

export default MessageAttachmentsModel;
