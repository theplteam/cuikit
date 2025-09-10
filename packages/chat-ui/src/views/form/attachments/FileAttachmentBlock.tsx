import * as React from 'react';
import { useChatSlots } from '../../core/ChatSlotsContext';
import { useChatContext } from '../../core/ChatGlobalContext';
import { useThreadContext } from '../../thread/ThreadContext';
import { ChatViewConstants } from '../../ChatViewConstants';
import { Stack } from '@mui/material';
import { FileAttachmentButtonFilesConfig } from './FileAttachmentButton';
import { FileAttachmentConfig } from './useFileAttachment';

type Props = {
  attachmentConfig: FileAttachmentConfig,
  isTyping?: boolean;
};

const FileAttachmentBlock: React.FC<Props> = ({ attachmentConfig, isTyping }) => {
  const { slots } = useChatSlots();
  const { enableFileAttachments } = useChatContext();
  const { thread } = useThreadContext();
  const { attachments, handleFileUpload, acceptableFormatToString, inputAccept } = attachmentConfig;

  const cameraRef = React.useRef<HTMLInputElement>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const onOpenFileDialog = (config?: FileAttachmentButtonFilesConfig) => {
    if (fileRef.current) {
      if (config?.acceptableFileFormat) {
        fileRef.current.setAttribute('accept', acceptableFormatToString(config?.acceptableFileFormat));
      }

      if (config?.multiple === false) {
        fileRef.current?.removeAttribute('multiple');
      }

      fileRef.current?.click();

      if (config?.acceptableFileFormat) {
        fileRef.current.setAttribute('accept', inputAccept);
      }

      if (config?.multiple === false) {
        fileRef.current.setAttribute('multiple', 'true');
      }
    }
  }

  const onOpenDeviceCamera = () => {
    cameraRef.current?.click();
  }

  const onFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(event.target.files);
    if (fileRef.current?.value) fileRef.current.value = '';
    if (cameraRef.current?.value) cameraRef.current.value = '';
  };

  const disabled = attachments.length >= ChatViewConstants.MAX_ATTACHMENTS_IN_MESSAGE || isTyping || !thread;

  if (!enableFileAttachments) return null;

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      width={48}
      height={40}
      position="relative"
    >
      <slots.attachmentFormButton
        disabled={disabled}
        onOpenDeviceCamera={onOpenDeviceCamera}
        onOpenFileDialog={onOpenFileDialog}
      />
      <input
        ref={cameraRef}
        capture="environment"
        type="file"
        accept="image/*,video/*"
        disabled={isTyping}
        style={{ display: 'none' }}
        onChange={onFileUpload}
      />
      <input
        ref={fileRef}
        multiple
        type="file"
        accept={inputAccept}
        disabled={isTyping}
        style={{ display: 'none' }}
        onChange={onFileUpload}
      />
    </Stack>
  );
};

export default FileAttachmentBlock;
