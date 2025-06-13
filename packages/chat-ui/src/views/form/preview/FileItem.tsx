import React from 'react';
import Stack from '@mui/material/Stack';
import useFilePreviewIcon from './useFilePreviewIcon';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

type Props = {
  name: string;
  type: string;
  error?: string;
};

const FileItem: React.FC<Props> = ({ name, type, error }) => {
  const Icon = useFilePreviewIcon(error ? 'error' : type);

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
          sx={{ color: error ? "inherit" : undefined }}
        >
          {fileName}
        </Typography>
        <Stack alignItems='center' gap={1} flexDirection="row">
          <Icon color={error ? "inherit" : "primary"} fontSize="small" />
          <Typography
            noWrap
            textOverflow='ellipsis'
            width={120}
            fontSize='0.75rem'
            sx={{ color: error ? "inherit" : undefined }}
          >
            {error || fileFormat}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default FileItem;
