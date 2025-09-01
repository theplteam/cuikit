import * as React from 'react';
import { HistoryContextType, HistorySlotType } from './HistoryType';
import { HistoryComponentProps } from '../../leftContainer/History';
import ThreadListMapBlockAllStyled from '../../leftContainer/listMap/ThreadListMapBlockAllStyled';
import TimeTextWrapper from '../../leftContainer/TimeTextWrapper';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import MdMenuItem from '../../../ui/menu/MdMenuItem';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ContainerSubtitle from '../../../ui/ContainerSubtitle';
import { CHAT_LOCALE } from '../../../locale/enEN';
import { ruRU } from '../../../locale/ruRU';
import { useObserverValue } from '../../../views/hooks/useObserverValue';
import internalApi from './internalApi';
import ListItemButton from '@mui/material/ListItemButton';

const useSlots = (slots?: Partial<HistorySlotType>) => {
  const componentSlots = React.useMemo(() => ({
    baseButton: slots?.baseButton ?? Button,
    baseIconButton: slots?.baseIconButton ?? IconButton,
    baseListItemText: slots?.baseListItemText ?? ListItemText,
    baseListItemButton: slots?.baseListItemButton ?? ListItemButton,
    baseMenuItem: slots?.baseMenuItem ?? MdMenuItem,
    historyContainer: slots?.historyContainer ?? Box,
    historyWrapper: slots?.historyWrapper ?? Stack,
    threadsList: slots?.threadsList ?? ThreadListMapBlockAllStyled,
    threadListItemMenuButton: slots?.threadListItemMenuButton ?? IconButton,
    listDrawer: slots?.listDrawer ?? Drawer,
    listSubtitle: slots?.listSubtitle ?? ContainerSubtitle,
    listTimeText: slots?.listTimeText ?? Typography,
    listTimeTextWrapper: slots?.listTimeTextWrapper ?? TimeTextWrapper,
    listDrawerTitle: slots?.listDrawerTitle ?? Typography,
    aiModelButton: slots?.aiModelButton ?? Button,
  }) as HistorySlotType, [slots]);

  return componentSlots;
};

const Context = React.createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider = ({ children, ...props }: React.PropsWithChildren<HistoryComponentProps>) => {
  const { apiRef, loading, threadActions, aiModelList, slotProps, openNewThreadOnModelChange } = props;
  const userLocale = props?.lang === 'ru' ? ruRU : CHAT_LOCALE;
  const userSlots = useSlots(props?.slots);
  const internal = useObserverValue(internalApi);

  const value: HistoryContextType = React.useMemo(() => ({
    internal,
    apiRef,
    loading: !!loading,
    threadActions: threadActions || [],
    slots: userSlots,
    locale: userLocale,
    slotProps: slotProps || {},
    aiModelList: aiModelList || [],
    openNewThreadOnModelChange: openNewThreadOnModelChange ?? false,
  }), [apiRef, internal, loading, props]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export const useHistoryContext = () => {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("useHistoryContext must be used within a HistoryProvider");
  }

  return context;
};
