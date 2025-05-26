import React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import AttachmentModel from '../../../models/AttachmentModel';
import { useObserverValue } from '../../hooks/useObserverValue';
import CircularLoadProgress from './CircularLoadProgress';
import PreviewDeleteButton from './PreviewDeleteButton';
import FileItem from './FileItem';
import GalleryItem from './GalleryItem';
import { useElementRef } from '../../../views/hooks/useElementRef';
import { useMobile } from '../../../ui/Responsive';
import useHover from '../../../views/hooks/useHover';
import { IdType } from '../../../types';

type Props = {
  item: AttachmentModel;
  galleryId: string;
  handleDelete: (id: IdType, url: string) => void;
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

  const ref = useElementRef();
  const isMobile = useMobile();
  const isHover = useHover(ref.current);

  const isVideo = type.startsWith('video');

  return (
    <BoxStyled ref={ref}>
      {(!progress || progress < 100) ? <CircularLoadProgress progress={progress} /> : null}
      {isGallery
        ? <GalleryItem id={`${galleryId}-${id}`} poster={poster} videoUrl={isVideo ? url : undefined} />
        : <FileItem name={name} type={type} />}
      {(isMobile || isHover) ? <PreviewDeleteButton onClick={() => handleDelete(id, url)} /> : null}
    </BoxStyled>
  );
};

export default PreviewItem;
