
const getPlaceholderImage = (text?: string) => {
  const img = document.createElement('img');
  img.src = `https://placehold.co/800?text=${text || 'Loading...'}`
  return img;
};

export default getPlaceholderImage;
