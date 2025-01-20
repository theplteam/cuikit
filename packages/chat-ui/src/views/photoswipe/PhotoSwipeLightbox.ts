import PhotoSwipeLightboxConstructor from 'photoswipe/lightbox';
import PhotoSwipeLightboxTypes from 'photoswipe/dist/types/lightbox/lightbox';

type Options = ConstructorParameters<typeof PhotoSwipeLightboxTypes>[0];

const PhotoSwipeLightbox = (options: Options) => {
  return new PhotoSwipeLightboxConstructor(options) as PhotoSwipeLightboxTypes;
};

export default PhotoSwipeLightbox;

