import { styled } from "@mui/material/styles";

const TimeTextWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(1.5, 2, 1, 1.5),
  position: 'sticky',
  top: 0,
  left: 0,
  backgroundColor: theme.palette.secondary.main,
  zIndex: 1,
}));

export default TimeTextWrapper;
