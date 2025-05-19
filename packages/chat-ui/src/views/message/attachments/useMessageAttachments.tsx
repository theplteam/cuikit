import React from 'react';
import { Attachment, ChatMessageContentType } from '../../../models';
import { base64FileDecode } from '../../../utils/base64File';
import loadUrlFile from '../../../utils/loadUrlFile';
import { IdType } from 'types';
import getVideoPoster from '../../../utils/getVideoPoster';

export type LoadedAttachment = {
  id: IdType;
  type: 'gallery' | 'file';
  file?: File;
  url?: string;
  poster?: HTMLImageElement;
};

const useMessageAttachments = (items: Attachment[]) => {
  const [attachments, setAttachments] = React.useState<LoadedAttachment[]>([]);
  const [deletedIds, setDeletedIds] = React.useState<IdType[]>([]);

  const loadAttachment = async (item: Attachment) => {
    const data: LoadedAttachment = {
      id: item.id,
      type: (item.type === ChatMessageContentType.IMAGE || item.type === ChatMessageContentType.VIDEO) ? 'gallery' : 'file',
    };
    if (item.type !== ChatMessageContentType.IMAGE) {
      const file = await loadFile(item);
      if (file) {
        data['file'] = file;
        data['url'] = URL.createObjectURL(file);

        if (item.type === ChatMessageContentType.VIDEO) {
          const poster = await loadVideoPoster(data.url);
          data['poster'] = poster;
        }
      }
    }

    if (item.type === ChatMessageContentType.IMAGE) {
      let src = '';
      if (item.url) src = item.url;
      else if (item.base64) {
        const file = base64FileDecode(item.base64);
        src = URL.createObjectURL(file);
      }
      const image = document.createElement('img');
      image.src = src;

      data['url'] = src;
      data['poster'] = image;
    }

    return data;
  }

  const loadFile = async (item: Attachment) => {
    let file: File | null = null;
    if (item?.url) {
      const res = await loadUrlFile(item.url);
      if (res) file = res;
    }
    else if (item?.base64) {
      file = base64FileDecode(item.base64);
    }
    return file;
  };

  const loadVideoPoster = async (url: string) => {
    const image = document.createElement('img');
    image.src = await getVideoPoster(url);
    return image;
  };

  const load = async () => {
    const buffer: LoadedAttachment[] = [];
    for (const attachment of items) {
      const item = await loadAttachment(attachment);
      buffer.push(item);
    }
    setAttachments(buffer);
  };

  React.useEffect(() => {
    load();
  }, [items]);

  return {
    attachments: attachments.filter((a) => !deletedIds.includes(a.id)),
    deletedIds,
    setDeletedIds,
  }
}

export default useMessageAttachments;
