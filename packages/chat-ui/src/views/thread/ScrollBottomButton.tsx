import * as React from 'react';
import { ArrowDropDown } from '../../icons';
import { useChatCoreSlots } from '../core/ChatSlotsContext';
import {getSurfaceColor} from "../utils/colors";

type Props = {
  enabled: boolean;
  onClick: () => void;
};

const ScrollBottomButton: React.FC<Props> = ({ enabled, onClick }) => {
  const coreSlots = useChatCoreSlots();
  return (
    <coreSlots.iconButton
      sx={{
        opacity: enabled ? 1 : 0,
        position: 'absolute',
        top: -64,
        left: '50%',
        transition: (theme) => theme.transitions.create(['opacity', 'box-shadow'], { duration: '200ms' }),
        transform: 'translateX(-50%)',
        zIndex: 1,
        background: (theme) => getSurfaceColor(theme),
        boxShadow: '0px 1px 18px rgba(0, 0, 0, 0.12), 0px 6px 10px rgba(0, 0, 0, 0.14), 0px 3px 5px rgba(0, 0, 0, 0.2);',
        '&:hover': {
          background: (theme) => getSurfaceColor(theme),
          boxShadow: '0px 3px 14px rgba(0, 0, 0, 0.12), 0px 8px 10px rgba(0, 0, 0, 0.14), 0px 5px 5px rgba(0, 0, 0, 0.2);',
        },
      }}
      size="small"
      onClick={onClick}
    >
      <ArrowDropDown />
    </coreSlots.iconButton>
  );
}

export default ScrollBottomButton;
