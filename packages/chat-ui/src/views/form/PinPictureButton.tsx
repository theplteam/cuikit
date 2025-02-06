import * as React from 'react';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useChatCoreSlots } from '../core/ChatSlotsContext';
import { materialDesignSysPalette } from './../../utils/materialDesign/palette';

type Props = {
  image: string;
  setImage: (img: string) => void;
  isTyping?: boolean;
};


const PinPictureButton: React.FC<Props> = ({ image, setImage, isTyping }) => {
  const coreSlots = useChatCoreSlots();
  const ref = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    ref.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    if (ref.current) ref.current.value = '';
  };

  return (
    <Box
      display={'flex'}
      alignItems={'flex-end'}
      width={48}
      height={40}
      position={'relative'}
    >
      {image
        ? (
          <Box
            display={'flex'}
            alignItems={'flex-end'}
            borderRadius={'50%'}
            style={{
              outline: `1px solid ${materialDesignSysPalette.outline}`,
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
            }}
          >
            <coreSlots.iconButton
              onClick={() => setImage('')}
              sx={{ backdropFilter: 'blur(1px)', background: 'none' }}
            >
              <CloseIcon sx={{ backgroundColor: 'white', borderRadius: '50%', outline: `1px solid ${materialDesignSysPalette.outline}` }} />
            </coreSlots.iconButton>
          </Box>
        ) : (
          <coreSlots.iconButton onClick={handleClick}>
            <AddIcon />
          </coreSlots.iconButton>
        )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={isTyping}
        style={{ display: 'none' }}
      />
    </Box>
  );
};

export default PinPictureButton;
