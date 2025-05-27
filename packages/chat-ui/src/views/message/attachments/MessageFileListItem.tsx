import React from 'react';
import Stack from '@mui/material/Stack';
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

const StackStyled = styled(Stack)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.grey[100],
  height: 80,
  width: 200,
  borderRadius: 16,
}));

const MessageFileListItem = ({ item, onDelete }: Props) => {
  const { id, name, type } = item;
  const ref = useElementRef();

  return (
    <StackStyled ref={ref}>
      <FileItem name={name} type={type} />
      {onDelete ? <PreviewDeleteButton onClick={() => onDelete(id)} /> : null}
    </StackStyled>
  );
}

export default MessageFileListItem;
