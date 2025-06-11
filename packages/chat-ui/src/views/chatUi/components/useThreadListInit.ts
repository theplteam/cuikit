import * as React from 'react';
import Typography from '@mui/material/Typography';
import ContainerSubtitle from '../../../ui/ContainerSubtitle';
import HiddenContent from '../../../views/HiddenContent';
import ThreadListItemMenuButton from '../../../views/leftContainer/ThreadListItemMenuButton';
import { ThreadListSlotType, ThreadListProps, ThreadListContextType } from '../../core/threadList/ThreadListType';
import { CHAT_LOCALE } from '../../../locale/enEN';
import { ruRU } from '../../../locale/ruRU';
import { ApiRefType } from '../../core/useApiRef';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import MdMenuItem from '../../../ui/menu/MdMenuItem';

const useSlots = (slots?: Partial<ThreadListSlotType>) => {
  const componentSlots = React.useMemo(() => ({
    baseButton: slots?.baseButton ?? Button,
    baseIconButton: slots?.baseIconButton ?? IconButton,
    baseListItemText: slots?.baseListItemText ?? ListItemText,
    baseMenuItem: slots?.baseMenuItem ?? MdMenuItem,
    listContainer: slots?.threadsList ? HiddenContent : slots?.listContainer ?? HiddenContent,
    threadsList: slots?.threadsList ?? HiddenContent,
    threadListItemMenuButton: slots?.threadListItemMenuButton ?? ThreadListItemMenuButton,
    listDrawer: slots?.threadsList ? HiddenContent : slots?.listDrawer ?? React.Fragment,
    listSubtitle: slots?.listSubtitle ?? ContainerSubtitle,
    listTimeText: slots?.listTimeText ?? Typography,
    listDrawerTitle: slots?.listDrawerTitle ?? Typography,
  }) as ThreadListSlotType, [slots]);

  return componentSlots;
};

export const useThreadListInit = (apiRef: React.MutableRefObject<ApiRefType | null>, loading?: boolean, props?: ThreadListProps) => {
  const userLocale = props?.locale === 'ru' ? ruRU : CHAT_LOCALE;
  const userSlots = useSlots(props?.slots);

  const data: ThreadListContextType = React.useMemo(() => ({
    apiRef,
    slots: userSlots,
    locale: userLocale,
    loading: !!loading,
    slotProps: props?.slotProps || {},
  }), [apiRef, loading, props]);
  
  return data;
};
