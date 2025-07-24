import SvgIcon from "@mui/material/SvgIcon";

export type ToolType = {
  type: string,
  label: string,
  icon?: typeof SvgIcon,
  chipLabel?: string,
};
