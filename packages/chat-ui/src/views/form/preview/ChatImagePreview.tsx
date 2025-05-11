import * as React from 'react';
import Box from '@mui/material/Box';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import Scrollbar from '../../../ui/Scrollbar';
import MessageAttachmentModel from '../../../models/MessageAttachmentModel';
import ImagePreviewItem from './ImagePreviewItem';
import 'photoswipe/style.css';

type Props = {
  images: MessageAttachmentModel[];
  handleDelete: (id: number) => void;
};

const ChatImagePreview: React.FC<Props> = ({ images, handleDelete }) => {
  const galleryId = 'gallery-preview';
  const lightbox: PhotoSwipeLightbox = React.useMemo(() => new PhotoSwipeLightbox({
    gallery: `#${galleryId}`,
    children: 'a',
    pswpModule: () => import('photoswipe'),
    zoom: false,
    showHideAnimationType: 'fade',
  }), []);

  React.useEffect(() => {
    lightbox.init();

    return () => {
      lightbox?.destroy();
    };
  }, []);

  return (
    <Scrollbar style={{ maxHeight: 64, borderRadius: 16 }}>
      <Box
        display="flex" flexWrap="wrap" gap={1}
        paddingRight="12px" className="pswp-gallery" id={galleryId}
      >
        {images.map((img, i) => (
          <ImagePreviewItem
            key={i}
            image={img}
            galleryId={galleryId}
            handleDelete={handleDelete}
          />
        ))}
      </Box>
    </Scrollbar>
  );
};

export default ChatImagePreview;
