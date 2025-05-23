import React from 'react';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import PreviewDeleteButton from '../../../views/form/preview/PreviewDeleteButton';
import { IdType } from '../../../types';
import FileItem from '../../../views/form/preview/FileItem';
import { LoadedAttachment } from './useMessageAttachments';
import { useElementRef } from '../../../views/hooks/useElementRef';

type Props = {
  item: LoadedAttachment;
  onDelete?: (id: IdType) => void;
};

const StackStyled = styled(Stack)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.grey[100],
  height: 64,
  borderRadius: 16,
}));

const MessageFileListItem = ({ item, onDelete }: Props) => {
  const { id, file } = item;
  const ref = useElementRef();

  if (!file) return null;

  return (
    <StackStyled ref={ref}>
      <FileItem name={file.name} type={file.type} />
      {onDelete ? <PreviewDeleteButton onClick={() => onDelete(id)} /> : null}
    </StackStyled>
  );
}

export default MessageFileListItem;
