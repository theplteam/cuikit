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

  & > span {
      opacity: 0;
  }
`;

const ReasoningTextSmooth: React.FC<Props> = ({ text }) => {
  // There's no need to use useMemo here because of memoizing the component, rendering isn't triggered repeatedly
  const texts = (text ?? '')
    .replaceAll('*', '')
    .replaceAll('_', '')
    .replaceAll('#', '')
    .split(' ')
    .map(v => `${v} `);

  const textLength = texts.length;

  return (
    <BoxStyled>
      {texts.map((v, i) => (
        <Typography
          // We have to use a truly unique key every time and keep it as simple as possible to maintain performance.
          // Sometimes, a word and its index coincide with the previous text, which causes a bug in the animation.
          key={v+''+i+textLength}
          component="span"
          style={{
            animation: `${animationName} 0.7s ease-in-out ${i * 0.04}s 1 normal forwards`
          }}
          color="grey.700"
        >
          {v}
        </Typography>
      ))}
    </BoxStyled>
  );
}

export default React.memo(ReasoningTextSmooth, (prevProps, nextProps) => prevProps.text === nextProps.text);
