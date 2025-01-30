import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Message, StreamResponseState } from '../../models/Message';
import { useObserverValue } from '../hooks/useObserverValue';
import { MdTextUi } from '../../ui/TextUi';
import { materialDesignSysPalette } from '../../utils/materialDesign/palette';

type Props = {
  message: Message;
};

const palette = materialDesignSysPalette;

const keyframeName = 'pl-analyze-await';
const BoxStyled = styled(Box)(() => ({
  [`@keyframes ${keyframeName}`]: {
    from: {
      backgroundPosition: '-100% top'
    },
    to: {
      backgroundPosition: '250% top'
    }
  },
  textFillColor: 'transparent',
  backgroundPosition: '-100% top',
  color: palette.outline,
  animationDelay: '.5s',
  animationDuration: '4.5s',
  animationIterationCount: 'infinite',
  animationName: keyframeName,
  background: `${palette.outlineVariant} -webkit-gradient(linear,100% 0,0 0,from(${palette.outlineVariant}),color-stop(.5,${palette.onSurface}),to(${palette.outlineVariant}))`,
  // background: `${palette.outlineVariant} linear-gradient(90deg, ${palette.outlineVariant} 0%, ${palette.onSurface} 50%, ${palette.outlineVariant} 100%)`,
  backgroundClip: 'text',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '50% 200%',
  width: '100%',
  cursor: 'default',
  /*'&:hover': {
    textFillColor: palette.onSurface,
    animation: 'none',
    background: 'transparent',
  },*/
  fallbacks: [
    {
      background: `linear-gradient(90deg, ${palette.outlineVariant} 0%, ${palette.onSurface} 50%, ${palette.outlineVariant} 100%)`
    }
  ]
}));

/*const steps = {
  [StreamResponseState.START]: [
    'Обрабатываю запрос...',
    'Process request',
  ],
  [StreamResponseState.ANALYZING_DATASET]: [
    'Анализирую статьи...',
    'Analyzing articles...'
  ],
  [StreamResponseState.PREPARING_ANSWER]: [
    'Подготавливаю ответ...',
    'Preparing an answer...'
  ],
};*/
const steps = {
  [StreamResponseState.START]: ['Думаю', 'Thinking'],
  [StreamResponseState.CREATE_DATASET]: ['Формирую список статей для анализа', 'Forming a list of articles for analysis'],
  [StreamResponseState.ANALYZING_DATASET]: ['Анализ статей...', 'Analyzing articles...'],
  [StreamResponseState.PREPARING_ANSWER]: ['Подготовка ответа...', 'Preparing an answer...'],
};

const ChatMessageAssistantProgress: React.FC<Props> = ({ message }) => {
  const state = useObserverValue(message.streamState);
  let text = state ? steps[state as keyof typeof steps] ?? '' : '';

  /*if (state === StreamResponseState.ANALYZING_DATASET && message.streamCurrentHeader) {
    text = capitalizeFirstLetter(message.streamCurrentHeader);
  }*/

  if (!text) return null;

  return (
    <BoxStyled>
      <MdTextUi m3typography={'body.mediumArticle'}>
        {text}
      </MdTextUi>
    </BoxStyled>
  );
};

export default ChatMessageAssistantProgress;
