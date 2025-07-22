import * as React from 'react';
import MdMenu from '../../../ui/menu/MdMenu';
import { useChatSlots } from '../../../views/core/ChatSlotsContext';
import { SettingsIcon } from '../../../icons';
import { ThreadModel } from '../../../models/ThreadModel';
import { useObserverValue } from '../../../views/hooks/useObserverValue';
import { useChatContext } from '../../../views/core/ChatGlobalContext';
import Stack from '@mui/material/Stack';
import { useMobile } from '../../../ui/Responsive';
import { ToolType } from '../../../types/ToolType';

type ToolsSelectProps = {
  thread?: ThreadModel;
};

const ToolsSelect: React.FC<ToolsSelectProps> = ({ thread }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { toolsList, onToolChanged } = useChatContext();
  const tool = useObserverValue(thread?.tool);
  const { coreSlots, slots } = useChatSlots();
  const isMobile = useMobile();

  const handleClose = () => setAnchorEl(null);
  const toggleMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl) {
      handleClose();
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleSelect = (item: ToolType) => {
    const newTool = tool?.type === item.type ? undefined : item;
    if (thread) thread.tool.value = newTool;
    onToolChanged?.(newTool?.type);
    handleClose();
  };

  if (!toolsList?.length) return null;

  return (
    <Stack direction='row' gap={1} alignItems='center'>
      <div>
        <coreSlots.iconButton onClick={toggleMenu}>
          <SettingsIcon />
        </coreSlots.iconButton>
        <MdMenu
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={handleClose}
        >
          {toolsList?.map((item) => (
            <coreSlots.menuItem
              key={item.type}
              startIcon={item.icon}
              selected={item.type === tool?.type}
              onClick={() => handleSelect(item)}
            >
              {item.label}
            </coreSlots.menuItem>
          ))}
        </MdMenu>
      </div>
      {(tool && thread) ? (
        <slots.chip
          icon={tool.icon ? <tool.icon fontSize='small' /> : undefined}
          label={isMobile ? undefined : (tool.chipLabel || tool.label)}
          onDelete={() => handleSelect(tool)}
        />
      ) : null}
    </Stack>
  );
}

export default ToolsSelect;
