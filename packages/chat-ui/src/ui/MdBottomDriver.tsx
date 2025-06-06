import * as React from 'react';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import { CloseIcon } from '../icons';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Scrollbar from './Scrollbar';
import { useChatSlots } from '../views/core/ChatSlotsContext';
import { materialDesignSysPalette } from '../utils/materialDesign/palette';

type Props = React.PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  title?: string | string[];
  disableCustomScrollbar?: boolean;
  keepMounted?: boolean;
}>;

const DrawerStyled = styled(Drawer)(() => ({
  [`.${drawerClasses.paper}`]: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  // zIndex: theme.zIndex.drawer + theme.zIndex.modal,
}));

const MdBottomDriver: React.FC<Props> = ({ open, onClose, title, children, disableCustomScrollbar, keepMounted }) => {
  const container = React.useRef<HTMLDivElement | null>(null);
  const { slots, slotProps, coreSlots } = useChatSlots();

  const height = 500;
  return (
    <>
      <DrawerStyled
        anchor="bottom"
        open={open}
        container={() => container.current}
        keepMounted={keepMounted}
        onClose={onClose}
      >
        <Stack pt={0.5}>
          <Stack px={0.5} direction="row" alignItems="center">
            <coreSlots.iconButton
              sx={{ color: () => materialDesignSysPalette.onSurfaceVariant }}
              onClick={onClose}
            >
              <CloseIcon />
            </coreSlots.iconButton>
            {!!title && (
              <slots.listDrawerTitle variant="subtitle1" {...slotProps.listDrawerTitle}>
                {title}
              </slots.listDrawerTitle>
            )}
          </Stack>
          {!!disableCustomScrollbar && children}
          {!disableCustomScrollbar && (
            <Scrollbar style={{ maxHeight: height }}>
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
