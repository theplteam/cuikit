import * as React from 'react';
import { CloseIcon } from '../icons';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Scrollbar from './Scrollbar';
import { useHistoryContext } from '../views/core/history/HistoryContext';
import { drawerClasses } from '@mui/material/Drawer';

type Props = React.PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  title?: string | string[];
  disableCustomScrollbar?: boolean;
  keepMounted?: boolean;
  className?: string;
}>;

const MdBottomDrawer: React.FC<Props> = ({ open, onClose, title, children, disableCustomScrollbar, keepMounted, className }) => {
  const container = React.useRef<HTMLDivElement | null>(null);
  const { slots, slotProps } = useHistoryContext();

  const height = 500;
  return (
    <>
      <slots.listDrawer
        anchor="bottom"
        open={open}
        container={() => container.current}
        keepMounted={keepMounted}
        sx={{
          [`.${drawerClasses.paper}`]: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        }}
        className={className}
        onClose={onClose}
        {...slotProps.listDrawer}
      >
        <Stack pt={0.5}>
          <Stack px={0.5} direction="row" alignItems="center">
            <slots.baseIconButton onClick={onClose} {...slotProps.baseIconButton}>
              <CloseIcon />
            </slots.baseIconButton>
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
      </slots.listDrawer>
      <Box ref={container} />
    </>
  );
}

export default MdBottomDrawer;
