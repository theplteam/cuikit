import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import 'photoswipe/style.css';
import PlayIcon from './PlayIcon';

type Props = {
  id: string;
  poster?: HTMLImageElement;
  videoUrl?: string;
  showPlayIcon?: boolean;
};

const GalleryItem: React.FC<Props> = ({ poster, id, videoUrl, showPlayIcon }) => {
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
      {showPlayIcon ? <PlayIcon /> : null}
      <img src={poster.src} alt="" />
    </a>
  );
}

export default GalleryItem;
