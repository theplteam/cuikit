import Box from "@mui/material/Box"
import { styled } from "@mui/material/styles"
import {getSurfaceColor} from "../../utils/colors";

export const PreviewErrorBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
}));

export const PreviewItemBox = styled(Box)(({ theme }) => ({
  backgroundColor: getSurfaceColor(theme),
  color: 'inherit',
}));
