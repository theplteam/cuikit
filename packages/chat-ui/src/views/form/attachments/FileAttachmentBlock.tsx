import * as React from 'react';
import AttachmentModel from '../../../models/AttachmentModel';
import { useChatSlots } from '../../core/ChatSlotsContext';
import { useChatContext } from '../../core/ChatGlobalContext';
import { useThreadContext } from '../../thread/ThreadContext';
import { useLocalizationContext } from '../../core/LocalizationContext';
import { ChatViewConstants } from '../../ChatViewConstants';
import { langReplace } from '../../../locale/langReplace';
import { Attachment } from '../../../models';
import { Stack } from '@mui/material';
import { FileAttachmentButtonFilesConfig } from './FileAttachmentButton';

type Props = {
  attachments: AttachmentModel[];
  setAttachments: (a: AttachmentModel[]) => void;
  isTyping?: boolean;
};

const FileAttachmentBlock: React.FC<Props> = ({ attachments, setAttachments, isTyping }) => {
  const { slots } = useChatSlots();
  const { enableFileAttachments, acceptableFileFormat, maxFileSizeBytes, maxFileCount, onFileAttached, snackbar, model } = useChatContext();
  const { thread } = useThreadContext();

  const cameraRef = React.useRef<HTMLInputElement>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const locale = useLocalizationContext();

  const onOpenFileDialog = (config?: FileAttachmentButtonFilesConfig) => {
    if (fileRef.current) {
      if (config?.acceptableFileFormat) {
        fileRef.current.setAttribute('accept', accetableFormatToString(config?.acceptableFileFormat));
      }

      if (config?.multiple === false) {
        fileRef.current?.removeAttribute('multiple');
      }

      fileRef.current?.click();

      if (config?.acceptableFileFormat) {
        fileRef.current.setAttribute('accept', accetableFormatToString(acceptableFileFormat));
      }

      if (config?.multiple === false) {
        fileRef.current.setAttribute('multiple', 'true');
      }
    }
  }

  const onOpenDeviceCamera = () => {
    cameraRef.current?.click();
  }

  const checkType = (file: File, allowedTypes: string[]) => {
    const fileType = file.type;
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();

    return allowedTypes.some((type) => {
      if (type === '*') return true;

      if (type.startsWith('.')) {
        return fileExt === type.toLowerCase();
      }

      if (type.endsWith('/*')) {
        const baseType = type.split('/')[0];
        return fileType.startsWith(baseType + '/');
      }

      return fileType === type;
    });
  }

  const maxCount = maxFileCount || ChatViewConstants.MAX_ATTACHMENTS_IN_MESSAGE;
  const maxSize = maxFileSizeBytes || ChatViewConstants.MAX_ATTACHMENT_SIZE;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    let files = Array.from(event.target.files || []);

    const oversizeFiles = files.filter(f => f.size > maxSize);
    if (oversizeFiles.length > 0) {
      snackbar.show(langReplace(locale.maxFileSizeWarning, { mb: Math.round(maxSize / 1024 / 1024) }), 'error');
      files = files.filter(f => f.size <= maxSize);
    }

    const allowedTypes = inputAccept.split(',').map(type => type.trim()).filter(type => type);
    const invalidFiles = files.filter(f => !checkType(f, allowedTypes));

    if (invalidFiles.length > 0) {
      snackbar.show(locale.invalidFileTypeWarning, 'error');
      files = files.filter(f => !invalidFiles.includes(f));
    }

    if ((files.length + attachments.length) > maxCount) {
      files = files.slice(0, maxCount - attachments.length);
      snackbar.show(locale.maxAttachmentWarning, 'error');
    };

    const fileAttachments = files.map((f) => {
      const type = f.type.startsWith('video') ? 'video' : f.type.startsWith('image') ? 'image' : 'file';
      const data: Omit<Attachment, 'id' | 'url'> = {
        type,
        file: f,
      };
      return new AttachmentModel(data);
    });
    setAttachments([...attachments, ...fileAttachments]);

    if (thread) {
      thread.isLoadingAttachments.value = [...thread.isLoadingAttachments.value, ...fileAttachments.map((f) => f.id)];
      fileAttachments.forEach((f) => {
        const { setProgress, setError, setId, file, id } = f;
        const onFinish = () => {
          f.progress.value = 100;
          thread.isLoadingAttachments.value = thread.isLoadingAttachments.value.filter((a) => a !== id);
        };
        if (onFileAttached) {
          const promise = onFileAttached({ id: f.id, file, actions: { setProgress, setError, onFinish, setId } });
          if (promise) promise.then(() => onFinish());
          else {
            onFinish();
          }
        } else {
          onFinish();
        }
      })
    }

    if (fileRef.current?.value) fileRef.current.value = '';
    if (cameraRef.current?.value) cameraRef.current.value = '';

    model.emitter.emit('onFilesAttached', { ids: fileAttachments.map(v => v.id) })
  };

  const disabled = attachments.length >= ChatViewConstants.MAX_ATTACHMENTS_IN_MESSAGE || isTyping || !thread;
  const inputAccept = React.useMemo(() => accetableFormatToString(acceptableFileFormat), [acceptableFileFormat]);

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
        onChange={handleFileUpload}
      />
      <input
        ref={fileRef}
        multiple
        type="file"
        accept={inputAccept}
        disabled={isTyping}
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
    </Stack>
  );
};

const accetableFormatToString = (acceptableFileFormat: string | string[] | undefined) => {
  if (!acceptableFileFormat) return '*';
  if (Array.isArray(acceptableFileFormat)) {
    return acceptableFileFormat.map((f) => ((f.includes('/') || f.includes('.')) ? f : `${f}/*`)).join(',');
  }
  return acceptableFileFormat;
};

export default FileAttachmentBlock;
