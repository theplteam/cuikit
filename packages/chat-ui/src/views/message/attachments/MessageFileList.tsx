import React from 'react';
import { FileContent } from '../../../models';
import Stack from '@mui/material/Stack';
import { base64FileDecode } from '../../../utils/base64File';
import { isDefined } from '../../../utils/isDefined';
import MessageFileListItem from './MessageFileListItem';

type Props = {
  files: FileContent[];
};

const MessageFileList = ({ files }: Props) => {
  const [items, setItems] = React.useState<File[]>([]);

  React.useEffect(() => {
    const getFiles = async () => {
      const formattedFiles = await Promise.all(files.map(async (f, idx) => {
        if (f?.url) {
          try {
            const response = await fetch(f.url);
            const blob = await response.blob();
            const name = f.url.split('/').pop() || `file_${idx}`;
            return new File([blob], name, { type: blob.type });
          } catch {
            return null;
          }
        }
        if (f?.base64) {
          return base64FileDecode(f.base64);
        }
        return null;
      }));
      setItems(formattedFiles.filter(isDefined));
    };

    getFiles();
  }, [files]);

  return (
    <Stack
      mx={1.5}
      gap={1}
      overflow="hidden"
      flexWrap="wrap"
      flexDirection="row"
      justifyContent="end"
    >
      {items.map((item, index) => <MessageFileListItem key={index} item={item} />)}
    </Stack >
  );
}

export default MessageFileList;
