import * as React from 'react';
import Stack from '@mui/material/Stack';
import { useChatContext } from '../../core/ChatGlobalContext';
import AttachmentModel from '../../../models/AttachmentModel';
import Scrollbar from '../../../ui/Scrollbar';
import { ThreadModel } from '../../../models/ThreadModel';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import PhotoSwipeVideoPlugin from 'photoswipe-video-plugin/dist/photoswipe-video-plugin.esm.js';
import PreviewItem from './PreviewItem';
import 'photoswipe/style.css';
import { IdType } from '../../../types';

type Props = {
  thread?: ThreadModel;
  attachments: AttachmentModel[];
  setAttachments: (a: AttachmentModel[]) => void;
};

const AttachmentsPreview: React.FC<Props> = ({ thread, attachments, setAttachments }) => {
  const { enableFileAttachments, onFileDetached } = useChatContext();

  const galleryId = 'gallery-preview';
  const lightbox: PhotoSwipeLightbox = React.useMemo(() => new PhotoSwipeLightbox({
    gallery: `#${galleryId}`,
    children: 'a',
    pswpModule: () => import('photoswipe'),
    zoom: false,
    showHideAnimationType: 'fade',
  }), []);

  React.useEffect(() => {
    new PhotoSwipeVideoPlugin(lightbox, {
      videoAttributes: { controls: true, playsinline: true, muted: true, preload: 'auto' },
    });
    lightbox.init();

    return () => {
      lightbox?.destroy();
    };
  }, [lightbox]);

  const handleDelete = (id: IdType, url: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
    onFileDetached?.(id);
    URL.revokeObjectURL(url);
    if (thread) {
      thread.isLoadingAttachments.value = thread.isLoadingAttachments.value.filter((i) => i !== id);
    }
  };

  if (!enableFileAttachments) return null;

  return (
    <Scrollbar style={{ maxHeight: 136, borderRadius: 16 }}>
      <Stack
        flexWrap="wrap"
        flexDirection="row"
        gap={1}
        paddingRight="12px"
        className="pswp-gallery"
        id={galleryId}
      >
        {attachments.map((a, i) => (
          <PreviewItem
            key={i}
            item={a}
            handleDelete={handleDelete}
            galleryId={galleryId}
          />
        ))}
      </Stack>
    </Scrollbar>
  );
};

export default AttachmentsPreview;
