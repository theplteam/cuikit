import React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import PreviewDeleteButton from '../../../views/form/preview/PreviewDeleteButton';
import GalleryItem from '../../../views/form/preview/GalleryItem';
import { IdType } from '../../../types';
import AttachmentModel from '../../../models/AttachmentModel';
import { useObserverValue } from '../../../views/hooks/useObserverValue';
import useGalleryItemSize from './useGalleryItemSize';

type Props = {
  item: AttachmentModel;
  galleryId: string;
  columns: number;
  rows: number;
  itemsCount: number;
  index: number;
  onDelete?: (id: IdType) => void;
};

const GridItem = styled(Box)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.common.white,
  position: 'relative',
  borderRadius: '8px',
  '& a': {
    width: '100%',
    height: '100%',
    lineHeight: 0,
    display: 'block',
  },
  '& img': {
    height: '100%',
    width: "inherit",
    objectFit: 'cover',
    aspectRatio: 'auto',
    objectPosition: 'center',
    borderRadius: '8px',
  },
}));

const MessageGalleryItem: React.FC<Props> = ({ item, galleryId, columns, rows, itemsCount, index, onDelete }) => {
  const { type, url } = item;
  const poster = useObserverValue(item.poster);
  const isVideo = type.startsWith('video');

  const getItemsInRow = (row: number) => {
    const startIndex = row * columns;
    const endIndex = Math.min(startIndex + columns, itemsCount);
    return endIndex - startIndex;
  };

  const size = useGalleryItemSize(itemsCount);
  const className = React.useMemo(() => {
    if (itemsCount === 1) return '';

    const row = Math.floor(index / columns);
    const itemsInRow = getItemsInRow(row);
    const col = index % columns;
    const isTopRow = row === 0;
    const isBottomRow = row === rows - 1;
    const isRightColumn = col === 0;
    const isLeftColumn = (col === columns - 1) || itemsInRow < 3 && !isRightColumn;
    const isLastAndSingle = isRightColumn && itemsInRow === 1 && isBottomRow;

    const className = `
      ${isTopRow ? 'top-row' : ''} 
      ${isBottomRow ? 'bottom-row' : ''} 
      ${isLeftColumn ? 'left-column' : ''} 
      ${isRightColumn ? 'right-column' : ''}
      ${isTopRow && itemsCount > 4 && itemsCount < 6 ? 'bottom-row' : ''}
      ${!isTopRow && !isBottomRow && itemsCount > 6 && itemsCount < 9 && !isRightColumn ? 'bottom-row' : ''}
      ${rows > 3 && index === 8 ? 'bottom-row' : ''}
      ${rows === 1 && isLeftColumn ? 'bottom-row' : ''}
      ${isLastAndSingle ? 'left-column' : ''}
    `;

    return className;
  }, [itemsCount]);

  return (
    <GridItem
      key={index}
      sx={{
        width: size,
        height: size,
      }}
      className={className}
    >
      <GalleryItem id={`${galleryId}-${item.id}`} poster={poster} videoUrl={isVideo ? url : undefined} />
      {onDelete ? <PreviewDeleteButton onClick={() => onDelete(item.id)} /> : null}
    </GridItem>
  );
}

export default MessageGalleryItem;
