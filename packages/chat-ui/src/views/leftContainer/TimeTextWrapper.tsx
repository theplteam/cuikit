import { styled } from "@mui/material/styles";
import {getSurfaceColor} from "../utils/colors";

const TimeTextWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(1.5, 2, 1, 1.5),
  position: 'sticky',
  top: 0,
  left: 0,
  backgroundColor: getSurfaceColor(theme),
  zIndex: 1,
}));

export default TimeTextWrapper;
