import React from 'react';

const useGalleryItemSize = (itemsCount: number) => {
  const size = React.useMemo(() => {
    if (itemsCount === 1) return 256;
    if (itemsCount >= 2 && itemsCount <= 6) return 128;
    return 80;
  }, []);

  return size;
}

export default useGalleryItemSize;
