import * as React from 'react';
import { useThreadContext } from '../../thread/ThreadContext';
import { useReasoningParse } from './useReasoningParse';
import ReasoningTextSmooth from './ReasoningTextSmooth';

type Props = {
  reasoning: string;
};

const MessageReasoningShort: React.FC<Props> = ({ reasoning }) => {
  const { apiRef } = useThreadContext()

  const { title, description } = useReasoningParse(reasoning);

  React.useEffect(() => {
    if (title) {
      apiRef.current?.setProgressStatus(title);
    }
  }, [title]);

  return (
    <ReasoningTextSmooth text={description} />
  );
}

export default MessageReasoningShort;
