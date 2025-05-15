import * as React from 'react';
import Stack from '@mui/material/Stack';
import { useChatContext } from '../../core/ChatGlobalContext';
import MessageGallery from './MessageGallery';
import MessageFiles from './MessageFileList';
import { MessageModel } from '../../../models';
import { IdType } from '../../../types';

type Props = {
  message: MessageModel;
  onDeleteAttachment?: (id: IdType) => void;
};

const MessageAttachments = ({ message, onDeleteAttachment }: Props) => {
  const { enableFileAttachments } = useChatContext();
  const { id, files, images } = React.useMemo(() => message, []);

  if (!enableFileAttachments) return null;

  return (
    <Stack gap={1}>
      {message.files.length ? <MessageFiles files={files} onDeleteItem={onDeleteAttachment} /> : null}
      {message.images.length ? <MessageGallery id={id} images={images} onDeleteItem={onDeleteAttachment} /> : null}
    </Stack>
  );
};

export default MessageAttachments;
