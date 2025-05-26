import AttachmentModel from "./AttachmentModel";

class AttachmentsStore {
  public items: AttachmentModel[] = [];
}

const attachmentsStore = new AttachmentsStore();

export default attachmentsStore;
