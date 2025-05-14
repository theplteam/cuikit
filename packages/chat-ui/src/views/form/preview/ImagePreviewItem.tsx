import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import MessageAttachmentModel from 'models/MessageAttachmentModel';
import { useObserverValue } from '../../../views/hooks/useObserverValue';
import CircularLoadProgress from './CircularLoadProgress';
import PreviewDeleteButton from './PreviewDeleteButton';
import 'photoswipe/style.css';

type Props = {
  image: MessageAttachmentModel;
  galleryId: string;
  handleDelete?: (id: number, url: string) => void;
};

const BoxStyled = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 64,
  width: 64,
  backgroundColor: theme.palette.grey[200],
  borderRadius: 16,
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

const ImagePreviewItem: React.FC<Props> = ({ image, galleryId, handleDelete }) => {
  const { url, id } = image;
  const progress = useObserverValue(image.progress);
  const poster = useObserverValue(image.poster);

  return (
    <BoxStyled>
      {(progress && progress < 100) ? <CircularLoadProgress progress={progress || 0} /> : null}
      <a
        key={`${galleryId}-${id}`}
        href={url}
        data-pswp-width={poster?.width}
        data-pswp-height={poster?.height}
        target="_blank"
        rel="noreferrer"
      >
        <img src={url} alt="" />
      </a>
      {handleDelete ? <PreviewDeleteButton onClick={() => handleDelete(id, url)} /> : null}
    </BoxStyled>
  );
};

export default ImagePreviewItem;
