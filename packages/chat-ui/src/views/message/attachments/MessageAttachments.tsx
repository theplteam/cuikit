import * as React from 'react';
import Stack from '@mui/material/Stack';
import { useChatContext } from '../../core/ChatGlobalContext';
import MessageGallery from './MessageGallery';
import MessageFiles from './MessageFileList';
import { IdType } from '../../../types';
import { LoadedAttachment } from './useMessageAttachments';
import { LinearProgress, Typography } from '@mui/material';
import { useLocalizationContext } from '../../core/LocalizationContext';

type Props = {
  messageId: IdType;
  attachments: LoadedAttachment[];
  onDeleteAttachment?: (id: IdType) => void;
  loading: boolean;
};

const MessageAttachments = ({ messageId, attachments, loading, onDeleteAttachment }: Props) => {
  const { enableFileAttachments } = useChatContext();
  const locale = useLocalizationContext();

  const galleryItems = attachments.filter((a) => a.type === 'gallery');
  const fileItems = attachments.filter((a) => a.type === 'file');

  if (!enableFileAttachments) return null;

  return (
    <Stack gap={1} mx={1.5} alignItems='end'>
      {loading
        ? (
          <>
            <Typography>
              {locale.messageAttachmentsLoading}
            </Typography>
            <LinearProgress sx={{ width: 180 }} />
          </>
        ) : (
          <>
            {fileItems.length ? <MessageFiles items={fileItems} onDeleteItem={onDeleteAttachment} /> : null}
            {galleryItems.length ? <MessageGallery id={messageId} items={galleryItems} onDeleteItem={onDeleteAttachment} /> : null}
          </>
        )}
    </Stack>
  );
};

export default MessageAttachments;
