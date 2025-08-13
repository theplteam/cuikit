import * as React from 'react';
import { useChatContext } from "../../core/ChatGlobalContext";
import { useLocalizationContext } from '../../core/LocalizationContext';
import { langReplace } from '../../../locale/langReplace';
import { ChatViewConstants } from '../../ChatViewConstants';
import AttachmentModel, { Attachment } from '../../../models/AttachmentModel';
import { useThreadContext } from '../../thread/ThreadContext';

export type FileAttachmentConfig = {
  attachments: AttachmentModel[],
  setAttachments: (value: AttachmentModel[]) => void,
  inputAccept: string,
  maxCount: number,
  maxSize: number,
  acceptableFormatToString: (acceptableFileFormat: string | string[] | undefined) => string,
  handleFileUpload: (fileList: FileList | null) => void,
};

const useFileAttachment = () => {
  const { thread } = useThreadContext();
  const { acceptableFileFormat, maxFileSizeBytes, maxFileCount, onFileAttached, snackbar, model } = useChatContext();
  const [attachments, setAttachments] = React.useState<AttachmentModel[]>([]);
  const locale = useLocalizationContext();

  const acceptableFormatToString = (acceptableFileFormat: string | string[] | undefined) => {
    if (!acceptableFileFormat) return '*';
    if (Array.isArray(acceptableFileFormat)) {
      return acceptableFileFormat.map((f) => ((f.includes('/') || f.includes('.')) ? f : `${f}/*`)).join(',');
    }
    return acceptableFileFormat;
  };

  const maxCount = React.useMemo(() => maxFileCount || ChatViewConstants.MAX_ATTACHMENTS_IN_MESSAGE, [maxFileCount]);
  const maxSize = React.useMemo(() => maxFileSizeBytes || ChatViewConstants.MAX_ATTACHMENT_SIZE, [maxFileSizeBytes]);
  const inputAccept = React.useMemo(() => acceptableFormatToString(acceptableFileFormat), [acceptableFileFormat]);

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
  };

  const handleFileUpload = (fileList: FileList | null) => {
    let files = Array.from(fileList || []);

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

    model.emitter.emit('onFilesAttached', { ids: fileAttachments.map(v => v.id) })
  };

  return {
    attachments,
    setAttachments,
    inputAccept,
    maxCount,
    maxSize,
    acceptableFormatToString,
    handleFileUpload,
  } as FileAttachmentConfig;
};

export default useFileAttachment;
