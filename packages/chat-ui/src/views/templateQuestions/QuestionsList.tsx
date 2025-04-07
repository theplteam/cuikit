import * as React from 'react';
import Stack from '@mui/material/Stack';
import { useQuestionTemplates } from './useQuestionTemplates';
import QuestionItem from './QuestionItem';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import { ThreadModel } from '../../models/ThreadModel';
import { useObserverValue } from '../hooks/useObserverValue';

type Props = {
  thread: ThreadModel;
};

const ContainerStyled = styled(Container)(() => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
}));

const QuestionsList: React.FC<Props> = ({ thread }) => {
  const questions = useQuestionTemplates();

  const messages = useObserverValue(thread.messages.allMessages) ?? [];

  const onClick = React.useCallback((_message: string) => {
    // thread.sendMessage(message);
  }, [thread]);

  if (messages.length) return null;

  return (
    <ContainerStyled>
      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
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
