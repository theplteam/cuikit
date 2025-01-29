import * as React from 'react';
import Stack from '@mui/material/Stack';
import { useChatContext } from 'chat-ui';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';

type Props = {};

const MobileAppBar: React.FC<Props> = () => {
  const { model } = useChatContext();
  return (
    <Stack
      gap={1}
      direction={'row'}
      alignItems={'center'}
      position={'sticky'}
      top={0}
      left={0}
      height={64}
      width={'100%'}
      zIndex={10}
    >
      <IconButton
        onClick={() => model.actions.menuDriverOpen.value = true}
      >
        <MenuIcon />
      </IconButton>
    </Stack>
  );
}

export default MobileAppBar;
