import React from 'react';
import getPlaceholderImage from '../../../utils/getPlaceholderImage';
import 'photoswipe/style.css';

type Props = {
  id: string;
  poster?: HTMLImageElement;
  videoUrl?: string;
};

const GalleryItem: React.FC<Props> = ({ poster, id, videoUrl }) => {
  const img = poster || getPlaceholderImage();

  return (
    <a
      key={id}
      href={videoUrl ? videoUrl : img.src}
      data-pswp-width={img.width}
      data-pswp-height={img.height}
      data-pswp-type={videoUrl ? "video" : undefined}
      data-pswp-video-src={videoUrl ? videoUrl : undefined}
      target="_blank"
      rel="noreferrer"
    >
      <img src={img.src} alt={id} />
    </a>
  );
}

export default GalleryItem;
