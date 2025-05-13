import * as React from 'react';
import Box from '@mui/material/Box';
import MessageAttachmentModel from '../../../models/MessageAttachmentModel';
import FilePreviewItem from './FilePreviewItem';

type Props = {
  files: MessageAttachmentModel[];
  handleDelete: (id: number, url: string) => void;
};

const ChatFilePreview: React.FC<Props> = ({ files, handleDelete }) => {

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      gap={1}
      paddingRight="12px"
    >
      {files.map((file, i) => (
        <FilePreviewItem
          key={i}
          file={file}
          handleDelete={handleDelete}
        />
      ))}
    </Box>
  );
};

export default ChatFilePreview;
