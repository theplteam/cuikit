import * as React from 'react';
import { useHistoryContext } from '../../views/core/history/HistoryContext';
import { ArrowDropDown } from '../../icons'
import MdMenu from '../../ui/menu/MdMenu';
import { useObserverValue } from '../../views/hooks/useObserverValue';
import { AIModelType } from '../../types/AiModelType';

const AIModelSelect: React.FC = () => {
  const { aiModelList, slots, internal, apiRef, slotProps } = useHistoryContext();
  const currentThread = useObserverValue(internal?.model.currentThread);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [active, setActive] = React.useState<undefined | AIModelType>(undefined);

  const handleClose = () => setAnchorEl(null);
  const toggleMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl) {
      handleClose();
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  React.useEffect(() => {
    if (!aiModelList.length) return;
    const find = aiModelList.find((m) => m.model === currentThread?.data.aiModel);
    setActive(find);
  }, [currentThread]);

  const handleSelect = (value: AIModelType) => {
    if (value.model !== active?.model) {
      const thread = apiRef.current?.handleCreateNewThread?.();
      if (thread) {
        thread.aiModel = value.model;
        apiRef.current?.openNewThread(thread);
      }
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
        {active?.label}
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
            selected={m.model === active?.model}
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
