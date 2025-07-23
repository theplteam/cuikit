import * as React from 'react';
import MdMenu from '../../../ui/menu/MdMenu';
import { useChatCoreSlots } from '../../../views/core/ChatSlotsContext';
import { SettingsIcon } from '../../../icons';
import { ThreadModel } from '../../../models/ThreadModel';
import { useObserverValue } from '../../../views/hooks/useObserverValue';
import { useChatContext } from '../../../views/core/ChatGlobalContext';
import Stack from '@mui/material/Stack';
import { useMobile } from '../../../ui/Responsive';

type ToolsSelectProps = {
  thread?: ThreadModel;
  isTyping?: boolean;
};

const ToolsSelect: React.FC<ToolsSelectProps> = ({ thread, isTyping }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { toolsList, onToolChanged } = useChatContext();
  const tool = useObserverValue(thread?.tool);
  const activeTool = toolsList?.find((t) => t.type === tool);
  const coreSlots = useChatCoreSlots();
  const isMobile = useMobile();

  const handleClose = () => setAnchorEl(null);
  const toggleMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl) {
      handleClose();
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleSelect = (type: string) => {
    const newValue = tool === type ? undefined : type;
    if (thread) thread.tool.value = newValue;
    onToolChanged?.(newValue);
    handleClose();
  };

  if (!toolsList?.length) return null;

  return (
    <Stack direction='row' gap={1} alignItems='center'>
      <div>
        <coreSlots.iconButton disabled={isTyping} onClick={toggleMenu}>
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
          {toolsList?.map(({ type, icon, label }) => (
            <coreSlots.menuItem
              key={type}
              startIcon={icon}
              selected={type === tool}
              onClick={() => handleSelect(type)}
            >
              {label}
            </coreSlots.menuItem>
          ))}
        </MdMenu>
      </div>
      {activeTool ? (
        <coreSlots.chip
          icon={activeTool.icon ? <activeTool.icon fontSize='small' /> : undefined}
          label={(isMobile && activeTool.icon) ? undefined : (activeTool.chipLabel ?? activeTool.label)}
          disabled={isTyping}
          onDelete={() => handleSelect(activeTool.type)}
        />
      ) : null}
    </Stack>
  );
}

export default ToolsSelect;
