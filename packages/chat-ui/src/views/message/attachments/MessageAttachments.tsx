import * as React from 'react';
import Stack from '@mui/material/Stack';
import { useChatContext } from '../../core/ChatGlobalContext';
import MessageGallery from './MessageGallery';
import MessageFiles from './MessageFileList';
import { IdType } from '../../../types';
import { LoadedAttachment } from './useMessageAttachments';

type Props = {
  messageId: IdType;
  attachments: LoadedAttachment[];
  onDeleteAttachment?: (id: IdType) => void;
};

const MessageAttachments = ({ messageId, attachments, onDeleteAttachment }: Props) => {
  const { enableFileAttachments } = useChatContext();

  const galleryItems = attachments.filter((a) => a.type === 'gallery');
  const fileItems = attachments.filter((a) => a.type === 'file');

  if (!enableFileAttachments) return null;

  return (
    <Stack gap={1}>
      {fileItems.length ? <MessageFiles items={fileItems} onDeleteItem={onDeleteAttachment} /> : null}
      {galleryItems.length ? <MessageGallery id={messageId} items={galleryItems} onDeleteItem={onDeleteAttachment} /> : null}
    </Stack>
  );
};

export default MessageAttachments;
