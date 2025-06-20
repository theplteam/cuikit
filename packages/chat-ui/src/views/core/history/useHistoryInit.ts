import * as React from 'react';
import Typography from '@mui/material/Typography';
import ContainerSubtitle from '../../../ui/ContainerSubtitle';
import { HistorySlotType, HistoryContextType } from './HistoryType';
import { CHAT_LOCALE } from '../../../locale/enEN';
import { ruRU } from '../../../locale/ruRU';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import MdMenuItem from '../../../ui/menu/MdMenuItem';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { ChatHistoryProps } from '../../leftContainer/ChatHistory';
import { Thread } from '../../../models/ThreadModel';
import ThreadListMapBlockAllStyled from '../../leftContainer/listMap/ThreadListMapBlockAllStyled';
import TimeTextWrapper from '../../leftContainer/TimeTextWrapper';
import HistoryModel from './HistoryModel';

const useSlots = (slots?: Partial<HistorySlotType>) => {
  const componentSlots = React.useMemo(() => ({
    baseButton: slots?.baseButton ?? Button,
    baseIconButton: slots?.baseIconButton ?? IconButton,
    baseListItemText: slots?.baseListItemText ?? ListItemText,
    baseMenuItem: slots?.baseMenuItem ?? MdMenuItem,
    historyContainer: slots?.historyContainer ?? Box,
    historyWrapper: slots?.historyWrapper ?? Stack,
    threadsList: slots?.threadsList ?? ThreadListMapBlockAllStyled,
    threadsListItem: slots?.threadsListItem ?? Box,
    threadListItemMenuButton: slots?.threadListItemMenuButton ?? IconButton,
    listDrawer: slots?.listDrawer ?? Drawer,
    listSubtitle: slots?.listSubtitle ?? ContainerSubtitle,
    listTimeText: slots?.listTimeText ?? Typography,
    listTimeTextWrapper: slots?.listTimeTextWrapper ?? TimeTextWrapper,
    listDrawerTitle: slots?.listDrawerTitle ?? Typography,
  }) as HistorySlotType, [slots]);

  return componentSlots;
};

export const useHistoryInit = (props: ChatHistoryProps) => {
  const { apiRef, loading, threadActions, } = props;
  const userLocale = props?.lang === 'ru' ? ruRU : CHAT_LOCALE;
  const userSlots = useSlots(props?.slots);
  const historyModel = new HistoryModel();

  React.useEffect(() => {
    if (apiRef.current) {
      apiRef.current.history.setMenuDriverOpen = (v: boolean) => historyModel.menuDriverOpen.value = v;
      apiRef.current.history.setDeleteItem = (v: Thread | undefined) => historyModel.deleteItem.value = v;
    }
  }, []);

  const data: HistoryContextType = React.useMemo(() => ({
    historyModel,
    apiRef,
    loading: !!loading,
    threadActions: threadActions || [],
    slots: userSlots,
    locale: userLocale,
    slotProps: props?.slotProps || {},
  }), [apiRef, loading, props]);
  
  return data;
};
