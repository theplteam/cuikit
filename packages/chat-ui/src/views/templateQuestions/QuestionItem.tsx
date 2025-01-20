import * as React from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { QuestionTemplateType } from './useQuestionTemplates';
import { MdText } from '../../ui/TextUi';

type Props = {
  item: QuestionTemplateType;
  onClick: (message: string) => void;
};

const PaperStyled = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  border: `1px solid ${theme.m3.sys.palette.outlineVariant}`,
  padding: theme.spacing(1),
  width: 133,
  height: 65,
  display: 'flex',
  alignItems: 'center',
  margin: 6,
  transition: theme.transitions.create('background', { duration: '100ms' }),
  cursor: 'pointer',
  '&:hover': {
    background: theme.m3.sys.palette.surfaceBright,
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
      <MdText>
        {item.title}
      </MdText>
    </PaperStyled>
  );
}

export default QuestionItem;
