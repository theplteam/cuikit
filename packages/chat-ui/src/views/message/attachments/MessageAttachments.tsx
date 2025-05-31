import * as React from 'react';
import Stack from '@mui/material/Stack';
import { useChatContext } from '../../core/ChatGlobalContext';
import MessageGallery from './MessageGallery';
import MessageFileList from './MessageFileList';
import { IdType } from '../../../types';
import { MessageModel } from '../../../models/MessageModel';
import { useObserverValue } from '../../../views/hooks/useObserverValue';

type Props = {
  message: MessageModel;
  onDeleteAttachment?: (id: IdType) => void;
};

const MessageAttachments: React.FC<Props> = ({ message, onDeleteAttachment }) => {
  const { enableFileAttachments } = useChatContext();
  const itemsAll = useObserverValue(message.attachments.itemsAll);
  const deletedIds = useObserverValue(message.attachments.deletedIds);

  const galleryItems = itemsAll?.filter((i) => i.isGallery && !deletedIds?.includes(i.id)) || [];

  const fileItems = itemsAll?.filter((i) => !i.isGallery && !deletedIds?.includes(i.id)) || [];

  if (!enableFileAttachments) return null;

  return (
    <Stack
      width="100%"
      alignItems='end'
      gap={1}
    >
      {galleryItems.length ? (
        <MessageGallery
          id={message.id}
          items={galleryItems}
          onDeleteItem={onDeleteAttachment}
        />) : null}
      {fileItems.length ? (
        <MessageFileList
          items={fileItems}
          onDeleteItem={onDeleteAttachment}
        />) : null}
    </Stack>
  );
};

export default MessageAttachments;
