import React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import PreviewDeleteButton from '../../../views/form/preview/PreviewDeleteButton';
import { IdType } from '../../../types';
import FileItem from '../../../views/form/preview/FileItem';
import AttachmentModel from '../../../models/AttachmentModel';
import { useObserverValue } from '../../../views/hooks/useObserverValue';
import Skeleton from '@mui/material/Skeleton';

type Props = {
  item: AttachmentModel;
  onDelete?: (id: IdType) => void;
};

const BoxStyled = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.grey[100],
  borderRadius: 16,
}));

const MessageFileListItem: React.FC<Props> = ({ item, onDelete }) => {
  const isEmpty = useObserverValue(item.isEmpty);
  const { id, name, type } = item;

  return (
    <BoxStyled
      minWidth={200}
      width={200}
      height={80}
    >
      {isEmpty
        ? (
          <Skeleton
            width="100%"
            height="100%"
            variant='rounded'
            sx={{ borderRadius: '16px' }}
          />
        ) : (
          <>
            <FileItem name={name} type={type} />
            {onDelete ? <PreviewDeleteButton onClick={() => onDelete(id)} /> : null}
          </>
        )}
    </BoxStyled>
  );
}

export default MessageFileListItem;
