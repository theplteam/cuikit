import React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import AttachmentModel from '../../../models/AttachmentModel';
import { useObserverValue } from '../../hooks/useObserverValue';
import CircularLoadProgress from './CircularLoadProgress';
import PreviewDeleteButton from './PreviewDeleteButton';
import FileItem from './FileItem';
import GalleryItem from './GalleryItem';
import { useElementRefState } from '../../../views/hooks/useElementRef';
import { useMobile } from '../../../ui/Responsive';
import useHover from '../../../views/hooks/useHover';
import { IdType } from '../../../types';
import PreviewTooltip from './PreviewTooltip';

type Props = {
  item: AttachmentModel;
  galleryId: string;
  handleDelete: (id: IdType, url: string) => void;
};

const BoxStyled = styled(Box)(() => ({
  position: 'relative',
  height: 80,
  borderRadius: 16,
  '& a': {
    height: 80,
    width: 80,
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
  const error = useObserverValue(item.error);
  const poster = useObserverValue(item.poster);

  const { element, setElement } = useElementRefState();
  const isHover = useHover(element);
  const isMobile = useMobile();

  const isVideo = type.startsWith('video');
  const showInGallery = isGallery && !error;

  return (
    <PreviewTooltip title={name}>
      <BoxStyled
        ref={setElement}
        width={showInGallery ? 80 : 200}
        sx={{
          backgroundColor: (theme) => error ? theme.palette.error.dark : theme.palette.grey[200],
          color: (theme) => error ? theme.palette.common.white : 'inherit',
        }}
      >
        {(!progress || progress < 100) ? <CircularLoadProgress progress={progress} /> : null}
        {showInGallery
          ? <GalleryItem id={`${galleryId}-${id}`} poster={poster} videoUrl={isVideo ? url : undefined} />
          : <FileItem name={name} type={type} error={error} />}
        {(isMobile || isHover) ? <PreviewDeleteButton onClick={() => handleDelete(id, url)} /> : null}
      </BoxStyled>
    </PreviewTooltip>
  );
};

export default PreviewItem;
