import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';

export type MdTooltipProps = React.PropsWithChildren<{
  type?: 'light' | 'dark';
}> & TooltipProps;

const TooltipStyled = styled(({ className, children, type, ...props }: MdTooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} children={children} />
))(({ theme, type }) => ({
  fontSize: theme.m3.materialTheme.body.small.fontSize,

  [`& .${tooltipClasses.tooltip}`]: type === 'light' ? {
    backgroundColor: theme.palette.common.white,
    color: theme.m3.sys.palette.inverseSurface,
    boxShadow: theme.shadows[1],
  } : {
    color: theme.m3.sys.palette.inverseOnSurface,
  },
}));

const MdTooltip: React.FC<MdTooltipProps> = (props) => {
  return (
    <TooltipStyled {...props} />
  );
}

export default MdTooltip;
