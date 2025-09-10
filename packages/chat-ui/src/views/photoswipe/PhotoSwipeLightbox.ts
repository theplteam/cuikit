import PhotoSwipeLightboxConstructor from 'photoswipe/lightbox';

type Options = ConstructorParameters<typeof PhotoSwipeLightboxConstructor>[0];

export type PhotoSwipeLightboxType = PhotoSwipeLightboxConstructor;

const PhotoSwipeLightbox = (options: Options) => {
  return new PhotoSwipeLightboxConstructor(options) as PhotoSwipeLightboxType;
};

export default PhotoSwipeLightbox;

