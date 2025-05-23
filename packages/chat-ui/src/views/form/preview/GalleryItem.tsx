import React from 'react';
import 'photoswipe/style.css';

type Props = {
  id: string;
  poster?: HTMLImageElement;
  videoUrl?: string;
};

const GalleryItem: React.FC<Props> = ({ poster, id, videoUrl }) => {
  return (
    <a
      key={id}
      href={videoUrl ? videoUrl : poster?.src}
      data-pswp-width={poster?.width}
      data-pswp-height={poster?.height}
      data-pswp-type={videoUrl ? "video" : undefined}
      data-pswp-video-src={videoUrl ? videoUrl : undefined}
      target="_blank"
      rel="noreferrer"
    >
      <img src={poster?.src} alt="" />
    </a>
  );
}

export default GalleryItem;
