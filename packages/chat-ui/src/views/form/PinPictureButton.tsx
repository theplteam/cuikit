import * as React from 'react';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import FolderIcon from '@mui/icons-material/Folder';
import { useChatCoreSlots } from '../core/ChatSlotsContext';
import { useMobile } from './../../ui/Responsive';
import MobileImageAppDriver from './MobileImageAppDriver';
import { useChatModel } from './../../views/core/ChatGlobalContext';
import Stack from '@mui/material/Stack';
import { lng } from './../../utils/lng';

type Props = {
  image: string;
  setImage: (img: string) => void;
  isTyping?: boolean;
};


const PinPictureButton: React.FC<Props> = ({ image, setImage, isTyping }) => {
  const coreSlots = useChatCoreSlots();
  const ref = React.useRef<HTMLInputElement>(null);
  const mobileRef = React.useRef<HTMLInputElement>(null);
  const isMobile = useMobile();
  const chat = useChatModel();

  const handleClick = () => {
    if (isMobile) {
      chat.actions.mobileImageDriverOpen.value = true;
      return;
    }

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

    if (ref.current?.value) ref.current.value = '';
    if (mobileRef.current?.value) mobileRef.current.value = '';
    if (isMobile) chat.actions.mobileImageDriverOpen.value = false;
  };

  return (
    <Stack
      alignItems={'flex-end'}
      width={48}
      height={40}
      position={'relative'}
    >
      <coreSlots.iconButton disabled={!!image || isTyping} onClick={handleClick}>
        <AddAPhotoIcon />
      </coreSlots.iconButton>
      <MobileImageAppDriver>
        <Stack gap={4} flexDirection={'row'} alignContent={'center'} justifyContent={'center'} height={100}>
          <Stack alignItems={'center'}>
            <coreSlots.iconButton onClick={() => mobileRef.current?.click()}>
              <AddAPhotoIcon sx={{ height: 60, width: 60 }} />
            </coreSlots.iconButton>
            {lng(['Сделать фото', 'Take a photo'])}
          </Stack>
          <Stack alignItems={'center'}>
            <coreSlots.iconButton onClick={() => ref.current?.click()}>
              <FolderIcon sx={{ height: 60, width: 60 }} />
            </coreSlots.iconButton>
            {lng(['Выбрать из галереи', 'Select from gallery'])}
          </Stack>
        </Stack>
      </MobileImageAppDriver>
      <input
        ref={mobileRef}
        type="file"
        accept="image/png,image/jpeg"
        capture
        onChange={handleImageUpload}
        disabled={isTyping}
        style={{ display: 'none' }}
      />
      <input
        ref={ref}
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleImageUpload}
        disabled={isTyping}
        style={{ display: 'none' }}
      />
    </Stack>
  );
};

export default PinPictureButton;
