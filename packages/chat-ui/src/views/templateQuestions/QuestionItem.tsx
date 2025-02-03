import * as React from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { QuestionTemplateType } from './useQuestionTemplates';
import { materialDesignSysPalette } from '../../utils/materialDesign/palette';
import { motion } from '../../utils/materialDesign/motion';
import Typography from '@mui/material/Typography';

type Props = {
  item: QuestionTemplateType;
  onClick: (message: string) => void;
};

const PaperStyled = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  border: `1px solid ${materialDesignSysPalette.outlineVariant}`,
  padding: theme.spacing(1),
  width: 133,
  height: 65,
  display: 'flex',
  alignItems: 'center',
  margin: 6,
  transition: theme.transitions.create('background', { duration: motion.duration.short2 }),
  cursor: 'pointer',
  '&:hover': {
    background: materialDesignSysPalette.surfaceBright,
  },
  [theme.breakpoints.down('md')]: {
    margin: 4,
  },
}));

const QuestionItem: React.FC<Props> = ({ item, onClick }) => {
  return (
    <PaperStyled
      onClick={() => onClick(item.message)}
      elevation={0}
    >
      <Typography>
        {item.title}
      </Typography>
    </PaperStyled>
  );
}

export default QuestionItem;
