import AttachmentModel, { Attachment } from "./AttachmentModel";
import { ObservableReactValue } from "../utils/observers/ObservableReactValue";
import { IdType } from "../types";
import attachmentsStore from "./AttachmentsStore";

class MessageAttachmentsModel {
  readonly deletedIds = new ObservableReactValue<IdType[]>([]);

  readonly itemsAll = new ObservableReactValue<AttachmentModel[]>([]);

  init = (attachments: Attachment[]) => {
    const buffer: AttachmentModel[] = [];

    for (const attachment of attachments) {
      const cacheItem = attachmentsStore.items.find((i) => i.id === attachment.id);
      if (cacheItem) {
        buffer.push(cacheItem);
        attachmentsStore.items = attachmentsStore.items.filter((a) => a.id !== attachment.id);
        continue;
      }
      const model = new AttachmentModel(attachment);
      buffer.push(model);
    }

    this.itemsAll.value = buffer;
  }
}

export default MessageAttachmentsModel;
