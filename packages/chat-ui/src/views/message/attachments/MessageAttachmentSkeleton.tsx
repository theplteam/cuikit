import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import useGalleryItemSize from './useGalleryItemSize';

type Props = {
  itemsCount: number;
  variant: 'file' | 'gallery';
};

const MessageAttachmentSkeleton: React.FC<Props> = ({ itemsCount, variant }) => {
  const array = Array.from({ length: itemsCount });
  const isGallery = variant === 'gallery';
  const gallerySize = useGalleryItemSize(itemsCount);

  return array.map((_v, index) => (
    <Skeleton
      key={index}
      variant='rounded'
      width={isGallery ? gallerySize : 200}
      height={isGallery ? gallerySize : 80}
    />
  ));
}

export default MessageAttachmentSkeleton;
