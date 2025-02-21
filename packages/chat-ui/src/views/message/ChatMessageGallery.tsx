import React from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import { IdType } from '../../types';
import 'photoswipe/style.css';
import { materialDesignSysPalette } from '../../utils/materialDesign/palette';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

type Props = {
  id: IdType;
  images: string[];
};

const GridItem = styled(Grid)(() => ({
  width: '100%',
  backgroundColor: materialDesignSysPalette.surfaceContainerLow,
  position: 'relative',
  '& a': {
    width: '100%',
    height: '100%',
    lineHeight: 0,
    display: 'block',
  },
  '& img': {
    maxHeight: 'min(120px, 80dvh)',
    height: '100%',
    width: "inherit",
    objectFit: 'cover',
    aspectRatio: 'auto',
    objectPosition: 'center',
    borderRadius: 16,
  },
  '&:last-child': {
    borderRadius: '16px 16px 0 16px',
    '& img': {
      borderRadius: '16px 16px 0 16px',
    }
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

  const ratio = items.length === 4 ? 4 : 3;
  return (
    <Grid
      container
      gap={1}
      className="pswp-gallery"
      id={galleryId}
      mx={1.5}
      justifyContent={'flex-end'}
    >
      {items.map(({ src, width, height }, index) => (
        <GridItem item xs={ratio} key={index} borderRadius={4}>
          <a
            href={src}
            data-pswp-width={width}
            data-pswp-height={height}
            key={`${galleryId}-${index}`}
            target="_blank"
            rel="noreferrer"
          >
            <img src={src} alt="" />
          </a>
        </GridItem>
      ))}
    </Grid>
  );
}

export default ChatMessageGallery;
