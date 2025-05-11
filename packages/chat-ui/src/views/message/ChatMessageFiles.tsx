import React from 'react';
import { FileContent } from '../../models';
import Box from '@mui/material/Box';

type Props = {
  files: FileContent[];
};

const ChatMessageFiles = ({ files }: Props) => {

  return (
    <Box
      display="grid"
      mx={1.5}
      gap={1}
      overflow="hidden"
    >
      {files.map((item, index) => (
        <div key={index}>
          {item.url}
        </div>
      ))}
    </Box >
  );
}

export default ChatMessageFiles;
