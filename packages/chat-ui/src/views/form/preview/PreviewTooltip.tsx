import React from 'react';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';

const PreviewTooltip = (props: TooltipProps) => {
  return (
    <Tooltip
      {...props}
      slotProps={{
        popper: {
          sx: {
            [`& .${tooltipClasses.tooltip}`]: {
              maxWidth: 180,
            },
            [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
            {
              marginTop: 1,
            },
          }
        }
      }}
    />
  );
};

export default PreviewTooltip;
