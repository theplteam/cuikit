import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import 'photoswipe/style.css';
import { useChatSlots } from '../../../views/core/ChatSlotsContext';

type Props = {
  id: string;
  poster?: HTMLImageElement;
  videoUrl?: string;
  showPlayIcon?: boolean;
  className?: string;
};

const GalleryItem: React.FC<Props> = ({ poster, id, videoUrl, showPlayIcon, className }) => {
  const { slots, slotProps } = useChatSlots();

  if (!poster) {
    return (
      <Skeleton
        variant='rounded'
        sx={{ borderRadius: '16px' }}
        width="100%"
        height="100%"
      />
    )
  }

  return (
    <a
      key={id}
      href={videoUrl ? videoUrl : poster.src}
      data-pswp-width={poster.width}
      data-pswp-height={poster.height}
      data-pswp-type={videoUrl ? "video" : undefined}
      data-pswp-video-src={videoUrl ? videoUrl : undefined}
      target="_blank"
      rel="noreferrer"
    >
      {showPlayIcon ? <slots.attachmentVideoPlayIcon {...slotProps.attachmentVideoPlayIcon} /> : null}
      <img className={className} src={poster.src} alt="" />
    </a>
  );
}

export default GalleryItem;
