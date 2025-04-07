import * as React from 'react';
import { useChatCoreSlots } from '../core/ChatSlotsContext';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import { styled } from '@mui/material/styles';
import { materialDesignSysPalette } from '../../utils/materialDesign/palette';
import Scrollbar from '../../ui/Scrollbar';

type Props = {
  images: string[];
  setImages: (images: string[]) => void;
};

const BoxStyled = styled(Box)(() => ({
  position: 'relative',
  height: 64,
  width: 64,
  '& a': {
    height: 'inherit',
    width: 'inherit',
    lineHeight: 0,
    display: 'block',
  },
  '& img': {
    height: 'inherit',
    width: 'inherit',
    objectFit: 'cover',
    aspectRatio: 'auto',
    objectPosition: 'center',
    borderRadius: 16,
  },
}));

const ChatImagePreview: React.FC<Props> = ({ images, setImages }) => {
  const [items, setItems] = React.useState<HTMLImageElement[]>([]);
  const coreSlots = useChatCoreSlots();

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

  React.useEffect(() => {
    const imgElements = images.map((src) => {
      const image = new Image();
      image.src = src;
      return image;
    })

    setTimeout(() => setItems(imgElements), 100);
  }, [images]);

  const handleClick = (target: string) => {
    setImages(images.filter((i) => i !== target));
  };

  return (
    <Scrollbar style={{ maxHeight: 64, borderRadius: 16 }}>
      <Box
        display="flex" flexWrap="wrap" gap={1}
        paddingRight="12px" className="pswp-gallery" id={galleryId}
      >
        {items.map(({ src, width, height }, index) => (
          <BoxStyled key={index}>
            <a
              key={`${galleryId}-${index}`}
              href={src}
              data-pswp-width={width}
              data-pswp-height={height}
              target="_blank"
              rel="noreferrer"
            >
              <img src={src} alt="" />
            </a>
            <coreSlots.iconButton
              size='small'
              sx={{
                position: 'absolute',
                padding: 0,
                top: 0,
                right: 0,
                outline: `4px solid ${materialDesignSysPalette.surfaceContainerLowest}`,
                backgroundColor: materialDesignSysPalette.surfaceContainerHighest,
                ":hover": {
                  backgroundColor: materialDesignSysPalette.surfaceContainerLow,
                },
              }}
              onClick={() => handleClick(src)}
            >
              <CloseIcon sx={{ width: 16, height: 16 }} />
            </coreSlots.iconButton>
          </BoxStyled>
        ))}
      </Box>
    </Scrollbar>
  );
};

export default ChatImagePreview;
