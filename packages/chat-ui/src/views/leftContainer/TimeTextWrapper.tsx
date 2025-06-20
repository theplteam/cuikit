import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

const TimeTextWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2, 1, 1.5),
  position: 'sticky',
  top: 0,
  left: 0,
  backgroundColor: theme.palette.background.default,
  zIndex: 1,
  [theme.breakpoints.down('md')]: {
    background: '#fff',
    top: 0,
  }
}));

export default TimeTextWrapper;