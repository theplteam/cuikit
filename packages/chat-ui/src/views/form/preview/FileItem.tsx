import React from 'react';
import Stack from '@mui/material/Stack';
import useFilePreviewIcon from './useFilePreviewIcon';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

type Props = {
  name: string;
  type: string;
};

const FileItem: React.FC<Props> = ({ name, type }) => {
  const Icon = useFilePreviewIcon(type);

  const { fileName, fileFormat } = React.useMemo(() => {
    const split = name.split('.');
    const fileFormat = split.pop()?.toUpperCase();
    const fileName = split.join('.');
    return { fileName, fileFormat };
  }, [name]);

  return (
    <Box width='100%' height='100%'>
      <Stack
        alignItems='start'
        justifyItems='center'
        paddingTop={2}
        paddingLeft={2}
        gap={0.5}
      >
        <Typography
          noWrap
          width={140}
          textOverflow='ellipsis'
          fontSize='0.875rem'
          fontWeight={500}
        >
          {fileName}
        </Typography>
        <Stack alignItems='center' gap={0.5} flexDirection="row">
          <Icon color="primary" fontSize="small" />
          <Typography fontSize='0.75rem'>
            {fileFormat}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default FileItem;
