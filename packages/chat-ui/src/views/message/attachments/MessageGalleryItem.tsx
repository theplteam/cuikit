import React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import PreviewDeleteButton from '../../../views/form/preview/PreviewDeleteButton';
import GalleryItem from '../../../views/form/preview/GalleryItem';
import { IdType } from '../../../types';
import AttachmentModel from '../../../models/AttachmentModel';
import { useObserverValue } from '../../../views/hooks/useObserverValue';

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
  aspectRatio: 1,
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
  const isVideo = type === 'video';

  const getItemsInRow = (row: number) => {
    const startIndex = row * columns;
    const endIndex = Math.min(startIndex + columns, itemsCount);
    return endIndex - startIndex;
  };

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
      ${row === rows - 2 && itemsCount % 3 !== 0 && isLeftColumn ? 'bottom-row' : ''}
      ${rows === 1 && isLeftColumn ? 'bottom-row' : ''}
      ${isLastAndSingle ? 'left-column' : ''}
    `;

    return className;
  }, [itemsCount]);

  return (
    <GridItem
      key={item.id}
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <GalleryItem
        id={`${galleryId}-${item.id}`}
        poster={poster}
        videoUrl={isVideo ? url : undefined}
        showPlayIcon={isVideo}
        className={className}
      />
      {onDelete ? <PreviewDeleteButton onClick={() => onDelete(item.id)} /> : null}
    </GridItem>
  );
}

export default MessageGalleryItem;
