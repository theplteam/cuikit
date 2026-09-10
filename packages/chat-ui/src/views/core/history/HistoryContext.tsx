import * as React from 'react';
import { HistoryContextType, HistorySlotPropsType, HistorySlotType } from './HistoryType';
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
import { useObserverValue } from '../../hooks/useObserverValue';
import internalApi from './internalApi';
import { useLocalizationInit } from '../useLocalizationInit';
import ThreadListItemRoot from "../../leftContainer/listMap/ThreadListItemRoot";
import { HISTORY_GROUP_HEADER_HEIGHT, HISTORY_ITEM_HEIGHT } from '../../leftContainer/listMap/historyListMetrics';

const useSlots = (slots?: Partial<HistorySlotType>) => {
  const componentSlots = React.useMemo(() => ({
    baseButton: slots?.baseButton ?? Button,
    baseIconButton: slots?.baseIconButton ?? IconButton,
    baseListItemText: slots?.baseListItemText ?? ListItemText,
    baseMenuItem: slots?.baseMenuItem ?? MdMenuItem,
    historyContainer: slots?.historyContainer ?? Box,
    historyWrapper: slots?.historyWrapper ?? Stack,
    threadsList: slots?.threadsList ?? ThreadListMapBlockAllStyled,
    listItemRoot: slots?.listItemRoot ?? ThreadListItemRoot,
    threadListItemMenuButton: slots?.threadListItemMenuButton ?? IconButton,
    listDrawer: slots?.listDrawer ?? Drawer,
    listSubtitle: slots?.listSubtitle ?? ContainerSubtitle,
    listTimeText: slots?.listTimeText ?? Typography,
    listTimeTextWrapper: slots?.listTimeTextWrapper ?? TimeTextWrapper,
    listDrawerTitle: slots?.listDrawerTitle ?? Typography,
  }) as HistorySlotType, [slots]);

  return componentSlots;
};

const Context = React.createContext<HistoryContextType | undefined>(undefined);

const EMPTY_THREAD_ACTIONS: HistoryContextType['threadActions'] = [];
const EMPTY_SLOT_PROPS: Partial<HistorySlotPropsType> = {};

export const HistoryProvider = ({ children, ...props }: React.PropsWithChildren<HistoryComponentProps>) => {
  const {
    apiRef,
    loading,
    threadActions,
    slotProps,
    enableDialogueRename,
    enableThreadPin,
    onPinThread,
    threadTypeIcons,
    enableVirtualization,
    itemHeight,
    groupHeaderHeight,
  } = props;
  const userLocale = useLocalizationInit(props.lang);
  const userSlots = useSlots(props?.slots);
  const internal = useObserverValue(internalApi);

  // Dependencies are listed by name on purpose. The previous `props` entry was
  // the rest object from the signature above — a fresh identity on every render,
  // so this memo never hit and every consumer re-rendered with it. The `|| []`
  // and `|| {}` literals were defeating it for the same reason and are hoisted
  // to module scope.
  const value: HistoryContextType = React.useMemo(() => ({
    internal,
    apiRef,
    loading: !!loading,
    threadActions: threadActions || EMPTY_THREAD_ACTIONS,
    slots: userSlots,
    locale: userLocale,
    slotProps: slotProps || EMPTY_SLOT_PROPS,
    enableDialogueRename: !!enableDialogueRename,
    enableThreadPin: !!enableThreadPin,
    onPinThread,
    threadTypeIcons,
    enableVirtualization: !!enableVirtualization,
    itemHeight: itemHeight ?? HISTORY_ITEM_HEIGHT,
    groupHeaderHeight: groupHeaderHeight ?? HISTORY_GROUP_HEADER_HEIGHT,
  }), [
    internal,
    apiRef,
    loading,
    threadActions,
    userSlots,
    userLocale,
    slotProps,
    enableDialogueRename,
    enableThreadPin,
    onPinThread,
    threadTypeIcons,
    enableVirtualization,
    itemHeight,
    groupHeaderHeight,
  ]);

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
