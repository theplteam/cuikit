import * as React from 'react';
import { NOOP } from '../../../utils/NOOP';
import PhotoSwipeLightbox from '../../photoswipe/PhotoSwipeLightbox';
import { chatClassNames } from '../../core/chatClassNames';

export const usePhotoswipeInitialization = (containerId: string | number, typing: boolean | undefined) => {
  React.useEffect(() => {
    if (typing) return NOOP;
    const lightbox = PhotoSwipeLightbox({
      gallery: `#${containerId}`,
      children: `a.${chatClassNames.markdownImage}`,
      pswpModule: () => import('photoswipe'),
      zoom: false,
      showHideAnimationType: 'fade',
    });

    lightbox.init();

    return () => {
      lightbox.destroy();
    }
  }, [typing, containerId]);
}
