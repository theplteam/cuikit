import { styled } from "@mui/material/styles";
import {getSurfaceColor} from "../utils/colors";
import { HISTORY_GROUP_HEADER_HEIGHT } from "./listMap/historyListMetrics";

const TimeTextWrapper = styled('div')(({ theme }) => ({
  // Explicit rather than implied by padding + line-height (which came to
  // 40.02px): the virtualizer positions headers from this number, so it has to
  // be exact and independent of the body2 metrics.
  height: HISTORY_GROUP_HEADER_HEIGHT,
  boxSizing: 'border-box',
  padding: theme.spacing(1.5, 2, 1, 1.5),
  position: 'sticky',
  top: 0,
  left: 0,
  backgroundColor: getSurfaceColor(theme),
  zIndex: 1,
}));

export default TimeTextWrapper;
