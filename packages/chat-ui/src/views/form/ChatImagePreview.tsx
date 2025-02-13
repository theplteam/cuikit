import * as React from 'react';
import { useChatCoreSlots } from '../core/ChatSlotsContext';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  image: string;
  setImage: (img: string) => void;
};

const ChatImagePreview: React.FC<Props> = ({ image, setImage }) => {
  const coreSlots = useChatCoreSlots();

  const handleClick = () => {
    setImage('');
  };

  if (!image) return null;
  return (
    <Box position={'relative'} width={'fit-content'} paddingLeft={2}>
      <img height={80} width={80} src={image} />
      <coreSlots.iconButton
        size={'small'}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
        }}
        onClick={handleClick}>
        <CloseIcon />
      </coreSlots.iconButton>
    </Box >
  );
};

export default ChatImagePreview;
