import {Theme} from "@mui/material";

export const getSurfaceColor = (theme: Theme) => {
  return theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[200];
}
