import * as React from 'react';
import Stack from '@mui/material/Stack';
import { useChatContext } from '../../core/ChatGlobalContext';
import MessageGallery from './MessageGallery';
import MessageFiles from './MessageFileList';
import { MessageModel } from 'models';

type Props = {
  message: MessageModel;
  handleDelete?: () => void;
};

const MessageAttachments = ({ message, handleDelete }: Props) => {
  const { enableFileAttachments } = useChatContext();
  const { id, files, images } = message;

  if (!enableFileAttachments) return null;

  return (
    <Stack gap={1}>
      {message.files.length ? <MessageFiles files={files} /> : null}
      {message.images.length ? <MessageGallery id={id} images={images} /> : null}
    </Stack>
  );
};

export default MessageAttachments;
