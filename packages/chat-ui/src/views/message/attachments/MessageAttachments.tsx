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
  const loadingGalleryCount = useObserverValue(message.attachments.loadingGalleryCount);
  const loadingFileCount = useObserverValue(message.attachments.loadingFileCount);

  const galleryItems = itemsAll?.filter((i) => i.isGallery && !deletedIds?.includes(i.id)) || [];

  const fileItems = itemsAll?.filter((i) => !i.isGallery && !deletedIds?.includes(i.id)) || [];

  if (!enableFileAttachments) return null;

  return (
    <Stack
      width="100%"
      mx={1.5}
      alignItems='end'
    >
      {(fileItems.length || loadingFileCount) ? (
        <MessageFileList
          items={fileItems}
          expectedItems={loadingFileCount}
          onDeleteItem={onDeleteAttachment}
        />) : null}
      {(galleryItems.length || loadingGalleryCount) ? (
        <MessageGallery
          id={message.id}
          items={galleryItems}
          expectedItems={loadingGalleryCount}
          onDeleteItem={onDeleteAttachment}
        />) : null}
    </Stack>
  );
};

export default MessageAttachments;
