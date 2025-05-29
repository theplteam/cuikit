import * as React from 'react';
import Stack from '@mui/material/Stack';
import { useChatContext } from '../../core/ChatGlobalContext';
import MessageGallery from './MessageGallery';
import MessageFileList from './MessageFileList';
import { IdType } from '../../../types';
import { MessageModel } from '../../../models/MessageModel';

type Props = {
  message: MessageModel;
  onDeleteAttachment?: (id: IdType) => void;
};

const MessageAttachments: React.FC<Props> = ({ message, onDeleteAttachment }) => {
  const { enableFileAttachments } = useChatContext();
  const { galleryItems, fileItems } = message.attachments;

  if (!enableFileAttachments) return null;

  return (
    <Stack
      width="100%"
      mx={1.5}
      alignItems='end'
    >
      {fileItems.length ? <MessageFileList items={fileItems} onDeleteItem={onDeleteAttachment} /> : null}
      {galleryItems.length ? <MessageGallery id={message.id} items={galleryItems} onDeleteItem={onDeleteAttachment} /> : null}
    </Stack>
  );
};

export default MessageAttachments;
