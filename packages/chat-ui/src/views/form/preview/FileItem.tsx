import React from 'react';
import Stack from '@mui/material/Stack';
import useFilePreviewIcon from './useFilePreviewIcon';
import Typography from '@mui/material/Typography';

type Props = {
  name: string;
  type: string;
};

const FileItem: React.FC<Props> = ({ name, type }) => {
  const Icon = useFilePreviewIcon(type);

  const ellipsis = React.useMemo(() => {
    if (name.length <= 12) return name;
    const split = name.split('.');
    const end = split[split.length - 2].slice(-4);
    const start = split[0].slice(0, 4);
    return `${start}...${end}.${split[split.length - 1]}`;
  }, [name]);

  return (
    <Stack
      width='100%'
      height='100%'
      alignItems='center'
      justifyItems='center'
      flexDirection="row"
      paddingX={1}
    >
      <Icon color="primary" fontSize="large" />
      <Typography>
        {ellipsis}
      </Typography>
    </Stack>
  );
};

export default FileItem;
