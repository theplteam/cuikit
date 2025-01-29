import CircularProgress from '@mui/material/CircularProgress/CircularProgress';
import { styled } from '@mui/material/styles';
import { materialDesignSysPalette } from '../utils/materialDesign/palette';

const MdCircularProgress = styled(CircularProgress)(() => ({
  color: materialDesignSysPalette.primary,
}));

export default MdCircularProgress;
