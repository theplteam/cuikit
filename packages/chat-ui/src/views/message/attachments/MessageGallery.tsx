import React from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import { IdType } from '../../../types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MessageGalleryItem from './MessageGalleryItem';
import PhotoSwipeVideoPlugin from 'photoswipe-video-plugin/dist/photoswipe-video-plugin.esm.js';
import AttachmentModel from '../../../models/AttachmentModel';
import 'photoswipe/style.css';
import useGalleryItemSize from './useGalleryItemSize';

type Props = {
  id: IdType;
  items: AttachmentModel[];
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

const MessageGallery: React.FC<Props> = ({ id, items, onDeleteItem }) => {
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

  const columns = React.useMemo(() => items.length < 4 ? items.length : items.length === 4 ? 2 : 3, [items.length]);
  const rows = React.useMemo(() => Math.ceil(items.length / columns), [columns, items.length]);
  const size = useGalleryItemSize(items.length);

  return (
    <GridBox
      id={galleryId}
      display="grid"
      gap={1}
      sx={{
        width: '100%',
        gridTemplateColumns: `repeat(${columns}, minmax(0, ${size}px))`,
        gridAutoRows: size,
        direction: 'rtl',
      }}
      overflow="hidden"
      className="pswp-gallery"
    >
      {items.map((item, index) => (
        <MessageGalleryItem
          key={item.id}
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
