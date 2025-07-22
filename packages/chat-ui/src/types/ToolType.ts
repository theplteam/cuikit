import SvgIcon from "@mui/material/SvgIcon";
import { IdType } from "../types";

export type ToolType = {
  id: IdType,
  icon: typeof SvgIcon,
  label: string,
  smallLabel: string,
};
