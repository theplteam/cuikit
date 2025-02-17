import * as React from 'react';
import { useChatCoreSlots } from '../core/ChatSlotsContext';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';

type Props = {
  images: string[];
  setImages: (images: string[]) => void;
};

const ChatImagePreview: React.FC<Props> = ({ images, setImages }) => {
  const coreSlots = useChatCoreSlots();

  const handleClick = (target: string) => {
    setImages(images.filter((i) => i !== target));
  };

  if (!images.length) return null;
  return (
    <Stack flexDirection={'row'} flexWrap={'wrap'}>
      {images.map((image, index) => (
        <Box position={'relative'} width={'fit-content'} paddingLeft={2} key={index}>
          <img height={80} width={80} src={image} />
          <coreSlots.iconButton
            size={'small'}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
            }}
            onClick={() => handleClick(image)}>
            <CloseIcon />
          </coreSlots.iconButton>
        </Box >
      ))}
    </Stack>
  );
};

export default ChatImagePreview;
