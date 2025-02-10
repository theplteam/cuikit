import * as React from 'react';
import Stack from '@mui/material/Stack';
import { useQuestionTemplates } from './useQuestionTemplates';
import QuestionItem from './QuestionItem';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import { DialogueLight } from '../../models/Dialogue';
import { useObserverValue } from '../hooks/useObserverValue';

type Props = {
  dialogue: DialogueLight;
};

const ContainerStyled = styled(Container)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
}));

const QuestionsList: React.FC<Props> = ({ dialogue }) => {
  const questions = useQuestionTemplates();

  const messages = useObserverValue(dialogue.messages.allMessages) ?? [];

  const onClick = React.useCallback((message: string) => {
    // dialogue.sendMessage(message);
  }, [dialogue]);

  if (messages.length) return null;

  return (
    <ContainerStyled>
      <Stack
        direction={'row'}
        flexWrap={'wrap'}
        justifyContent={'center'}
      >
        {questions.map((questionItem, key) => (
          <QuestionItem
            key={key}
            item={questionItem}
            onClick={onClick}
          />
        ))}
      </Stack>
    </ContainerStyled>
  );
};

export default QuestionsList;
