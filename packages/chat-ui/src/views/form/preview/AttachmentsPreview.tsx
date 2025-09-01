import * as React from 'react';
import Stack from '@mui/material/Stack';
import { useChatContext } from '../../core/ChatGlobalContext';
import AttachmentModel from '../../../models/AttachmentModel';
import { ThreadModel } from '../../../models/ThreadModel';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import PhotoSwipeVideoPlugin from 'photoswipe-video-plugin/dist/photoswipe-video-plugin.esm.js';
import PreviewItem from './PreviewItem';
import 'photoswipe/style.css';
import { IdType } from '../../../types';
import { useMobile } from '../../../ui/Responsive';
import SimpleScrollbar from '../../../ui/SimpleScrollbar';

type Props = {
  thread?: ThreadModel;
  attachments: AttachmentModel[];
  setAttachments: (a: AttachmentModel[]) => void;
};

const AttachmentsPreview: React.FC<Props> = ({ thread, attachments, setAttachments }) => {
  const { enableFileAttachments, onFileDetached } = useChatContext();
  const isMobile = useMobile();
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
    <SimpleScrollbar style={{ maxHeight: 170, borderRadius: 16 }}>
      <Stack
        flexWrap={isMobile ? "nowrap" : "wrap"}
        flexDirection="row"
        gap={1}
        className="pswp-gallery"
        id={galleryId}
        paddingRight={(attachments.length && isMobile) ? 0 : 1.5}
        paddingBottom={attachments.length ? 1.5 : 0}
      >
        {attachments.map((a) => (
          <PreviewItem
            key={a.id}
            item={a}
            handleDelete={handleDelete}
            galleryId={galleryId}
          />
        ))}
      </Stack>
    </SimpleScrollbar>
  );
};

export default AttachmentsPreview;
