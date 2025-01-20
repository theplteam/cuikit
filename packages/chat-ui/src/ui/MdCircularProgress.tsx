import CircularProgress from '@mui/material/CircularProgress/CircularProgress';
import { styled } from '@mui/material/styles';

const MdCircularProgress = styled(CircularProgress)(({ theme }) => ({
  color: theme.m3.sys.palette.primary,
}));

export default MdCircularProgress;
