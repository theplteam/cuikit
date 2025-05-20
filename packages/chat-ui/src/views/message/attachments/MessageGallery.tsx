import React from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import { IdType } from '../../../types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MessageGalleryItem from './MessageGalleryItem';
import { LoadedAttachment } from './useMessageAttachments';
import PhotoSwipeVideoPlugin from 'photoswipe-video-plugin/dist/photoswipe-video-plugin.esm.js';
import 'photoswipe/style.css';

type Props = {
  id: IdType;
  items: LoadedAttachment[];
  onDeleteItem?: (id: IdType) => void;
};

const GridBox = styled(Box)(() => ({
  ".top-row.left-column": {
    borderTopLeftRadius: '24px',
  },
  ".top-row.right-column": {
    borderTopRightRadius: '24px',
  },
  ".bottom-row.left-column": {
    borderBottomLeftRadius: '24px',
  },
  ".bottom-row.right-column": {
    borderBottomRightRadius: '0px !important',
  },
}));

const MessageGallery = ({ id, items, onDeleteItem }: Props) => {
  const galleryId = `gallery-${id}`;
  const lightbox: PhotoSwipeLightbox = React.useMemo(() => new PhotoSwipeLightbox({
    gallery: `#${galleryId}`,
    children: 'a',
    pswpModule: () => import('photoswipe'),
    zoom: false,
    showHideAnimationType: 'fade',
  }), [id]);

  React.useEffect(() => {
    new PhotoSwipeVideoPlugin(lightbox, {
      videoAttributes: { controls: true, playsinline: true, muted: true, preload: 'auto' },
    });
    lightbox.init();

    return () => {
      lightbox?.destroy();
    };
  }, [lightbox]);

  const columns = React.useMemo(() => items.length === 4 ? 2 : 3, [items.length]);
  const rows = React.useMemo(() => Math.ceil(items.length / columns), [columns, items.length]);

  return (
    <GridBox
      id={galleryId}
      display="grid"
      gap={1}
      sx={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        direction: 'rtl',
      }}
      overflow="hidden"
      className="pswp-gallery"
    >
      {items.map((item, index) => (
        <MessageGalleryItem
          key={index}
          item={item}
          galleryId={galleryId}
          columns={columns}
          rows={rows}
          itemsCount={items.length}
          index={index}
          onDelete={onDeleteItem}
        />
      ))}
    </GridBox>
  );
}

export default MessageGallery;
