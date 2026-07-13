import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import Typography from '@mui/material/Typography';

type Props = {
  text: string;
};

const animationName = 'chat-ui-fadeInReasoning';

const BoxStyled = styled(Box)`
  @keyframes ${animationName} {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const cleanText = (text: string) => text
  .replaceAll('*', '')
  .replaceAll('_', '')
  .replaceAll('#', '');

const ReasoningTextSmooth: React.FC<Props> = ({ text }) => {
  const cleaned = cleanText(text ?? '');

  const renderedRef = React.useRef('');
  const chunksRef = React.useRef<string[]>([]);

  // Idempotent: re-running with the same cleaned value (e.g. StrictMode double-render) is a no-op.
  if (cleaned !== renderedRef.current) {
    const prev = renderedRef.current;
    if (prev && cleaned.startsWith(prev)) {
      const suffix = cleaned.slice(prev.length);
      if (suffix) chunksRef.current = [...chunksRef.current, suffix];
    } else {
      chunksRef.current = cleaned ? [cleaned] : [];
    }
    renderedRef.current = cleaned;
  }

  const chunks = chunksRef.current;
  const lastIndex = chunks.length - 1;

  return (
    <BoxStyled>
      {chunks.map((chunk, i) => (
        <Typography
          key={i}
          component="span"
          color="grey.700"
          style={
            i === lastIndex
              ? { animation: `${animationName} 0.7s ease-in-out 0s 1 normal forwards`, opacity: 0 }
              : { opacity: 1 }
          }
        >
          {chunk}
        </Typography>
      ))}
    </BoxStyled>
  );
};

export default React.memo(ReasoningTextSmooth, (prev, next) => prev.text === next.text);
