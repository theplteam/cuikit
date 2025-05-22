import React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import MessageAttachmentModel from '../../../models/MessageAttachmentModel';
import { useObserverValue } from '../../hooks/useObserverValue';
import CircularLoadProgress from './CircularLoadProgress';
import PreviewDeleteButton from './PreviewDeleteButton';
import FileItem from './FileItem';
import GalleryItem from './GalleryItem';

type Props = {
  item: MessageAttachmentModel;
  galleryId: string;
  handleDelete: (id: number, url: string) => void;
};

const BoxStyled = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 64,
  minWidth: 64,
  borderRadius: 16,
  backgroundColor: theme.palette.grey[200],
  '& a': {
    height: 64,
    width: 64,
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

const PreviewItem: React.FC<Props> = ({ item, galleryId, handleDelete }) => {
  const { url, id, name, type, isGallery } = item;
  const progress = useObserverValue(item.progress);
  const poster = useObserverValue(item.poster);

  const isVideo = type.startsWith('video');

  return (
    <BoxStyled>
      {(!progress || progress < 100) ? <CircularLoadProgress progress={progress} /> : null}
      {isGallery
        ? <GalleryItem id={`${galleryId}-${id}`} poster={poster} videoUrl={isVideo ? url : undefined} />
        : <FileItem name={name} type={type} />}
      <PreviewDeleteButton onClick={() => handleDelete(id, url)} />
    </BoxStyled>
  );
};

export default PreviewItem;
