import * as React from 'react';
import { NOOP } from '../../../utils/NOOP';
import PhotoSwipeLightbox, { PhotoSwipeLightboxType } from '../../photoswipe/PhotoSwipeLightbox';
import { chatClassNames } from '../../core/chatClassNames';

export const usePhotoswipeInitialization = (containerId: string | number, typing: boolean | undefined) => {
  React.useEffect(() => {
    if (typing) return NOOP;
    let lightbox: PhotoSwipeLightboxType | undefined;
    try {
      lightbox = PhotoSwipeLightbox({
        gallery: `#${containerId}`,
        children: `a.${chatClassNames.markdownImage}`,
        pswpModule: () => import('photoswipe'),
        zoom: false,
        showHideAnimationType: 'fade',
      });

      lightbox.init();
    } catch (e) {
      console.error('Gallery initialization error: ', e, containerId);
    }

    return () => {
      lightbox?.destroy();
    }
  }, [typing, containerId]);
}
