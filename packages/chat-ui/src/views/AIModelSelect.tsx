import * as React from 'react';
import { ArrowDropDown } from '../icons'
import MdMenu from '../ui/menu/MdMenu';
import { useObserverValue } from './hooks/useObserverValue';
import { AIModelType } from '../types/AIModelType';
import { useChatContext } from './core/ChatGlobalContext';
import { useChatSlots } from './core/ChatSlotsContext';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const BoxStyled = styled(Box)(({ theme }) => ({
  position: 'sticky', 
  top: 16, 
  left: 16, 
  width: 'fit-content',
  backgroundColor: theme.palette.background.paper,
  borderRadius: 16,
}));

const AIModelSelect: React.FC = () => {
  const { aiModelList, openNewThreadOnModelChange, model, apiRef } = useChatContext();
  const { slots, coreSlots, slotProps } = useChatSlots();

  const currentThread = useObserverValue(model.currentThread);
  const aiModel = useObserverValue(currentThread?.aiModel);
  const activeModel = React.useMemo(() => aiModelList?.find((m) => m.model === aiModel), [aiModel]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);


  const handleClose = () => setAnchorEl(null);
  const toggleMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl) {
      handleClose();
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleSelect = (value: AIModelType) => {
    if (openNewThreadOnModelChange) {
      if (value.model !== aiModel) {
        const thread = apiRef.current?.handleCreateNewThread?.();
        if (thread) {
          thread.aiModel = value.model;
          apiRef.current?.openNewThread(thread);
        }
      }
    } else if (currentThread) {
      currentThread.aiModel.value = value.model;
    }

    handleClose();
  };

  if (!aiModelList?.length) return null;

  return (
    <BoxStyled>
      <slots.aiModelButton
        endIcon={<ArrowDropDown />}
        onClick={toggleMenu}
        {...slotProps.aiModelButton}
      >
        {activeModel?.label}
      </slots.aiModelButton>
      <MdMenu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={handleClose}
      >
        {aiModelList?.map((m) => (
          <coreSlots.listItemButton
            key={m.model}
            selected={m.model === aiModel}
            onClick={() => handleSelect(m)}
          >
            <coreSlots.listItemText
              primary={m.label}
              secondary={m.description}
            />
          </coreSlots.listItemButton>
        ))}
      </MdMenu>
    </BoxStyled>
  );
}

export default AIModelSelect;
