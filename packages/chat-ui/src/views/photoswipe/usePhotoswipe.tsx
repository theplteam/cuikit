import React from 'react';
import PhotoSwipeLightbox from './PhotoSwipeLightbox';
import { SlideData } from 'photoswipe';
import { BLOCK_CHILDREN_KEY } from './PhotoSwipe';
import 'photoswipe/style.css';
import '../photoswipe/skin/skin.css';
import PhotoSwipeLightboxConstructor from 'photoswipe/lightbox';
import { randomInt } from '../../utils/numberUtils/randomInt';

type Props = {
  gallery?: {
    elements: {
      id: string | number;
      image: {
        id?: number;
        src: string;
        origins?: string;
        preview: string;
        width: number;
        height: number;
      };
    }[],
  };
  onGalleryOpen?: () => void;
  onSlideChange?: (index: number) => void;
  elementsSource?: 'className' | 'containerChildren';
}

export const usePhotoswipe = ({ gallery, onGalleryOpen, onSlideChange, elementsSource }: Props) => {
  const containerIdRef = React.useRef('pswp-gallery' + randomInt(1, 100000));
  const [psClass, setPsClass] = React.useState<PhotoSwipeLightboxConstructor | undefined>()

  React.useEffect(
    () => {
      if (!gallery) return;
      let children: HTMLElement[] | string = [];

      if (elementsSource === 'containerChildren') {
        const parent = document.getElementById(containerIdRef.current);
        if (parent) {
          children = Array.from(parent.getElementsByClassName(BLOCK_CHILDREN_KEY)) as HTMLElement[];
        }
      } else {
        children = `.${BLOCK_CHILDREN_KEY}`;
      }

      const lightbox = PhotoSwipeLightbox({
        gallerySelector: `#${containerIdRef.current}`,
        children,
        bgOpacity: 1,
        pswpModule: () => import('photoswipe'),
        zoom: false,
        dataSource: gallery.elements
          .filter(v => !!v.image)
          .map((galleryElement) => ({
            src: galleryElement.image?.src,
            width: galleryElement.image?.width,
            height: galleryElement.image?.height,
            elementId: galleryElement.id,
          }))
      });

      const getGalleryElement = (slideData: SlideData) => {
        const galleryElementIdStr = slideData.data.element?.dataset['galleryElementId'];
        if (galleryElementIdStr) {
          const galleryElementId = +galleryElementIdStr;
          return gallery.elements.find(element => element.id === galleryElementId);
        }
        return undefined;
      }

      const getCurrentItem = () => {
        const currSlide = lightbox.pswp?.currSlide;
        if (!currSlide) return undefined;
        return getGalleryElement(currSlide);
      }

      const download = () => {
        const element = getCurrentItem();
        if (!element?.image?.origins) return;
        const aNode = document.createElement('a');
        aNode.href = element.image.origins + '/download';
        aNode.target = '_blank';
        aNode.click();
      }

      lightbox.on('uiRegister', () => {
        const canDownload = gallery.elements.some(el => el.image?.origins !== undefined);
        if (canDownload) {
          lightbox.pswp?.ui?.registerElement({
            name: 'download',
            ariaLabel: 'Download',
            order: 9,
            isButton: true,
            html: {
              isCustomSVG: true,
              inner: '<path d="M 25.2 16.8 L 21.6 20.4 V 10.8 h -3.72 v 9.6 l -3.48 -3.48 L 12 19.2 l 7.2 7.32 l 8.4 -7.32 Z M 28.8 27.6 H 10.8 v 2.4 h 18 Z" id="pswp__icn-download"/>',
              outlineID: 'pswp__icn-download'
            },
            onClick: download
          });
        }
      });

      lightbox.init();

      setPsClass(lightbox);

      const divElement = document.getElementById(containerIdRef.current);
      if (divElement) {
        const videoElements = divElement.querySelectorAll('video');
        videoElements.forEach(video => {
          video.addEventListener('click', function() {
            if (!video.paused) {
              video.pause();
            }
          });
        });
      }

      return () => { lightbox.destroy(); }
    },
    [gallery],
  );

  React.useEffect(() => {
    const lightbox = psClass;
    if (lightbox) {
      if (onGalleryOpen) {
        lightbox.on('openingAnimationStart', onGalleryOpen);
      }

      const slideChange = () => {
        // console.log(lightbox.pswp?.currIndex);
        if (lightbox.pswp?.currIndex !== undefined) {
          onSlideChange?.(lightbox.pswp.currIndex);
        }
      };

      if (onSlideChange) {
        lightbox.on('change', slideChange);
      }

      return () => {
        if (onGalleryOpen) {
          lightbox.off('openingAnimationStart', onGalleryOpen);
        }

        if (onSlideChange) {
          lightbox.off('change', slideChange);
        }
      };
    }

    return undefined;
  }, [psClass, onGalleryOpen, onSlideChange]);

  return {
    galleryId: containerIdRef.current,
  };
};

export default usePhotoswipe;
