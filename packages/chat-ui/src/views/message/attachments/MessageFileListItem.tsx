import React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import PreviewDeleteButton from '../../../views/form/preview/PreviewDeleteButton';
import { IdType } from '../../../types';
import FileItem from '../../../views/form/preview/FileItem';
import { useElementRef } from '../../../views/hooks/useElementRef';
import AttachmentModel from '../../../models/AttachmentModel';

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
  const { id, name, type } = item;
  const ref = useElementRef();

  return (
    <BoxStyled
      ref={ref}
      minWidth={200}
      width={200}
      height={80}
    >
      <FileItem name={name} type={type} />
      {onDelete ? <PreviewDeleteButton onClick={() => onDelete(id)} /> : null}
    </BoxStyled>
  );
}

export default MessageFileListItem;
