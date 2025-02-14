import PhotoSwipeLightboxConstructor from 'photoswipe/lightbox';

type Options = ConstructorParameters<typeof PhotoSwipeLightboxConstructor>[0];

const PhotoSwipeLightbox = (options: Options) => {
  return new PhotoSwipeLightboxConstructor(options) as PhotoSwipeLightboxConstructor;
};

export default PhotoSwipeLightbox;

