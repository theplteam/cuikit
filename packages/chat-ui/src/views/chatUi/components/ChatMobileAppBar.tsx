import * as React from 'react';
import { MenuIcon } from '../../../icons';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useMobile } from '../../../ui/Responsive';
import { ApiRefType } from '../../core/useApiRef';
import {getSurfaceColor} from "../../utils/colors";

type Props = {
  apiRef: React.MutableRefObject<ApiRefType | null>;
};

const ChatMobileAppBar: React.FC<Props> = ({ apiRef }) => {
  const isMobile = useMobile();
  const handleClick = () => {
    apiRef.current?.setMenuDrawerOpen?.(true);
  };

  if (!isMobile) return null;

  return (
    <Stack
      height={64}
      paddingX={1}
      justifyContent="center"
      sx={{
        backgroundColor: (theme) => getSurfaceColor(theme),
      }}
    >
      <Box>
        <IconButton onClick={handleClick}>
          <MenuIcon />
        </IconButton>
      </Box>
    </Stack>
  );
}

export default ChatMobileAppBar;
