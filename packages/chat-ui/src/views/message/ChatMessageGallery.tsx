import React, { useEffect } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import { IdType } from '../../types';
import 'photoswipe/style.css';
import { Stack } from '@mui/system';
import Box from '@mui/material/Box';
import { materialDesignSysPalette } from '../../utils/materialDesign/palette';
import { styled } from '@mui/material/styles';

type Props = {
  id: IdType;
  images: string[];
};

const BoxStyled = styled(Box)(() => ({
  width: '100%',
  backgroundColor: materialDesignSysPalette.surfaceContainerLow,
  position: 'relative',
  '& a': {
    width: 'inherit',
  },
  '& img': {
    maxHeight: 'min(500px, 80dvh)',
    objectFit: 'contain',
    objectPosition: 'center',
    aspectRatio: 'auto',
    width: 'inherit',
  },
}));

const ChatMessageGallery = ({ id, images }: Props) => {
  const [items, setItems] = React.useState<HTMLImageElement[]>([]);
  const galleryId = `gallery-${id}`;

  useEffect(() => {
    const imgElements = images.map((src) => {
      const image = new Image();
      image.src = src;

      return image;
    })

    setItems(imgElements);

    let lightbox: PhotoSwipeLightbox | null = new PhotoSwipeLightbox({
      gallery: `#${galleryId}`,
      children: 'a',
      pswpModule: () => import('photoswipe'),
      zoom: false,
      showHideAnimationType: 'fade',
    });
    lightbox.init();

    return () => {
      lightbox?.destroy();
      lightbox = null
    };
  }, [images, id]);

  return (
    <Stack
      gap={1}
      className="pswp-gallery"
      id={galleryId}
      flexDirection={'row'}
      mx={1.5}
    >
      {items.map(({ src, width, height }, index) => (
        <BoxStyled borderRadius={4}>
          <a
            href={src}
            data-pswp-width={width}
            data-pswp-height={height}
            key={`${galleryId}-${index}`}
            target="_blank"
            rel="noreferrer"
            style={{
              lineHeight: 0,
              display: 'block',
            }}
          >
            <img src={src} alt="" />
          </a>
        </BoxStyled>
      ))}
    </Stack>
  );
}

export default ChatMessageGallery;
