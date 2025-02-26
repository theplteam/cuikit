import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import { materialTheme } from '../utils/materialDesign/materialTheme';
import { materialDesignSysPalette } from '../utils/materialDesign/palette';

export type MdTooltipProps = React.PropsWithChildren<{
  type?: 'light' | 'dark';
}> & TooltipProps;

const TooltipStyled = styled(({ className, children, type, ...props }: MdTooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} >
    {children}
  </Tooltip>
))(({ theme, type }) => ({
  fontSize: materialTheme.body.small.fontSize,

  [`& .${tooltipClasses.tooltip}`]: type === 'light' ? {
    backgroundColor: theme.palette.common.white,
    color: materialDesignSysPalette.inverseSurface,
    boxShadow: theme.shadows[1],
  } : {
    color: materialDesignSysPalette.inverseOnSurface,
  },
}));

const MdTooltip: React.FC<MdTooltipProps> = (props) => {
  return (
    <TooltipStyled {...props} />
  );
}

export default MdTooltip;
