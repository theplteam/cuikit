import * as React from 'react';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Scrollbar from './Scrollbar';
import { MdTextUi } from './TextUi';
import { useChatCoreSlots } from '../views/core/ChatSlotsContext';
import { materialDesignSysPalette } from '../utils/materialDesign/palette';

type Props = React.PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  title?: string | string[];
  disableCustomScrollbar?: boolean;
  keepMounted?: boolean;
}>;

const DrawerStyled = styled(Drawer)(({ theme }) => ({
  [`.${drawerClasses.paper}`]: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  // zIndex: theme.zIndex.drawer + theme.zIndex.modal,
}));

const MdBottomDriver: React.FC<Props> = ({ open, onClose, title, children, disableCustomScrollbar, keepMounted }) => {
  const container = React.useRef<HTMLDivElement | null>(null);
  const coreSlots = useChatCoreSlots();

  const height = 500;
  return (
    <>
      <DrawerStyled
        anchor={'bottom'}
        open={open}
        onClose={onClose}
        container={() => container.current}
        keepMounted={keepMounted}
      >
        <Stack pt={0.5}>
          <Stack px={0.5} direction={'row'} alignItems={'center'}>
            <coreSlots.iconButton
              sx={{ color: (theme) => materialDesignSysPalette.onSurfaceVariant }}
              onClick={onClose}
            >
              <CloseIcon />
            </coreSlots.iconButton>
            {!!title && (
              <MdTextUi m3typography={'title.large'} color={'onBackground'}>
                {title}
              </MdTextUi>
            )}
          </Stack>
          {!!disableCustomScrollbar && children}
          {!disableCustomScrollbar && (
            <Scrollbar style={{ height, maxHeight: height }}>
              {children}
            </Scrollbar>
          )}
        </Stack>
      </DrawerStyled>
      <Box ref={container} />
    </>
  );
}

export default MdBottomDriver;
