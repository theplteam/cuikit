import React from 'react';
import { Attachment } from '../../../models';
import Stack from '@mui/material/Stack';
import { base64FileDecode } from '../../../utils/base64File';
import { isDefined } from '../../../utils/isDefined';
import MessageFileListItem, { MessageFileListItemType } from './MessageFileListItem';
import { IdType } from '../../../types';

type Props = {
  files: Attachment[];
  onDeleteItem?: (id: IdType) => void;
};

const MessageFileList = ({ files, onDeleteItem }: Props) => {
  const [items, setItems] = React.useState<MessageFileListItemType[]>([]);

  const onDelete = (id: IdType) => {
    onDeleteItem?.(id);
    setItems(items.filter((i) => i.id !== id));
  };

  React.useEffect(() => {
    const getFiles = async () => {
      const formattedFiles = await Promise.all(files.map(async (f, idx) => {
        let file: File | null = null;
        if (f?.url) {
          try {
            const response = await fetch(f.url);
            const blob = await response.blob();
            const name = f.url.split('/').pop() || `file_${idx}`;
            file = new File([blob], name, { type: blob.type });
          } catch (e) {
            console.error(e);
          }
        }
        else if (f?.base64) {
          file = base64FileDecode(f.base64);
        }
        return file ? { id: f.id, data: file } : null;
      }));
      setItems(formattedFiles.filter(isDefined));
    };

    getFiles();
  }, []);

  return (
    <Stack
      mx={1.5}
      gap={1}
      overflow="hidden"
      flexWrap="wrap"
      flexDirection="row"
      justifyContent="end"
    >
      {items.map((item, index) => (
        <MessageFileListItem
          key={index}
          item={item}
          onDelete={onDeleteItem ? () => onDelete(item.id) : undefined}
        />
      ))}
    </Stack >
  );
}

export default MessageFileList;
