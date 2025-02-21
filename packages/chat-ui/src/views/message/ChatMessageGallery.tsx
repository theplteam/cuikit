import React from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import { IdType } from '../../types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ChatMessageGalleryItem from './ChatMessageGalleryItem';

type Props = {
  id: IdType;
  images: string[];
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

const ChatMessageGallery = ({ id, images }: Props) => {
  const [items, setItems] = React.useState<HTMLImageElement[]>([]);
  const galleryId = `gallery-${id}`;
  const lightbox: PhotoSwipeLightbox = React.useMemo(() => new PhotoSwipeLightbox({
    gallery: `#${galleryId}`,
    children: 'a',
    pswpModule: () => import('photoswipe'),
    zoom: false,
    showHideAnimationType: 'fade',
  }), [id]);

  React.useEffect(() => {
    lightbox.init();

    return () => {
      lightbox?.destroy();
    };
  }, []);

  React.useEffect(() => {
    const imgElements = images.map((src) => {
      const image = new Image();
      image.src = src;
      return image;
    })

    setItems(imgElements);
  }, [images]);

  const columns = React.useMemo(() => items.length === 4 ? 2 : 3, [items.length]);
  const rows = React.useMemo(() => Math.ceil(items.length / columns), [columns, items.length]);

  return (
    <GridBox
      id={galleryId}
      display={'grid'}
      mx={1.5}
      gap={1}
      sx={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        direction: 'rtl',
      }}
      overflow={'hidden'}
      className={"pswp-gallery"}
    >
      {items.map((item, index) => (
        <ChatMessageGalleryItem
          item={item}
          galleryId={galleryId}
          columns={columns}
          rows={rows}
          itemsCount={items.length}
          index={index}
          key={index}
        />
      ))}
    </GridBox >
  );
}

export default ChatMessageGallery;
