import * as React from 'react';
import { useHistoryContext } from '../../views/core/history/HistoryContext';
import { ArrowDropDown } from '../../icons'
import MdMenu from '../../ui/menu/MdMenu';
import { useObserverValue } from '../../views/hooks/useObserverValue';
import { AIModelType } from '../../types/AIModelType';

const AIModelSelect: React.FC = () => {
  const { aiModelList, openNewThreadOnModelChange, slots, internal, apiRef, slotProps } = useHistoryContext();

  const currentThread = useObserverValue(internal?.model.currentThread);
  const aiModel = useObserverValue(currentThread?.aiModel);
  const activeModel = React.useMemo(() => aiModelList.find((m) => m.model === aiModel), [aiModel]);

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

  if (!aiModelList.length) return null;

  return (
    <div>
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
          <slots.baseListItemButton
            key={m.model}
            selected={m.model === aiModel}
            onClick={() => handleSelect(m)}
            {...slotProps.baseListItemButton}
          >
            <slots.baseListItemText
              primary={m.label}
              secondary={m.description}
              {...slotProps.baseListItemText}
            />
          </slots.baseListItemButton>
        ))}
      </MdMenu>
    </div>
  );
}

export default AIModelSelect;
