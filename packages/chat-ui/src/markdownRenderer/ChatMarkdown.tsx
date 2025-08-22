import * as React from 'react';
import { ChatSlotsProvider } from '../views/core/ChatSlotsContext';
import {
  getMarkdownSlotProps,
  getMarkdownSlots,
  SlotValue,
} from '../views/core/usePropsSlots';
import MessageMarkdown from '../views/message/markdown/MessageMarkdown';
import Box from '@mui/material/Box';
import clsx from 'clsx';
import { chatClassNames } from '../views/core/chatClassNames';
import { keyframes, styled } from '@mui/material/styles';
import { ChatViewConstants } from '../views/ChatViewConstants';
import { SlotPropsType } from '../views/core/SlotPropsType';
import { usePhotoswipeInitialization } from '../views/message/hooks/usePhotoswipeInitialization';
import { v4 as uuid4 } from 'uuid';
type ExtractMarkdownKeys<T> = {
  [K in keyof T as K extends `markdown${string}` ? K : never]: T[K]
}

type MarkdownSlotsPropsType = ExtractMarkdownKeys<SlotPropsType<any, any>>;

type SlotsType = { [key in keyof MarkdownSlotsPropsType]: SlotValue<MarkdownSlotsPropsType[key]> }

type Props = React.PropsWithChildren<{
  text: string;
  inProgress: boolean;
  loading?: boolean;
  slots?: Partial<SlotsType>;
  slotProps?: Partial<MarkdownSlotsPropsType>;
  className?: string;
}>;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const BoxStyled = styled(Box)({
  width: '100%',
  flexDirection: 'column',
  [`.${chatClassNames.markdownSmoothedPending}`]: {
    opacity: 0,
  },
  [`.${chatClassNames.markdownSmoothedAnimating}`]: {
    opacity: 0,
    // here `delay` has no meaning, since it is overwritten in style for each element
    animation: `${fadeIn} ${ChatViewConstants.TEXT_SMOOTH_ANIMATION_DURATION_MS}ms ease-in-out 0ms 1 normal forwards`,
  },
});

const MarkdownComponent = React.memo(MessageMarkdown);

const ChatMarkdown: React.FC<Props> = ({ slots: slotsUser, slotProps: slotPropsUser, children, className, inProgress, loading, text }) => {

  const slots = React.useMemo(() => getMarkdownSlots(slotsUser), [slotsUser]);
  const slotProps = React.useMemo(() => getMarkdownSlotProps(slotPropsUser), [slotPropsUser]);

  const containerId = React.useMemo(() => 'id' + uuid4(), []);
  usePhotoswipeInitialization(containerId, inProgress);

  return (
    <BoxStyled
      id={containerId}
      className={clsx(chatClassNames.messageAssistantRoot, className)}
    >
      <ChatSlotsProvider slots={slots} slotProps={slotProps}>
        {!loading && <MarkdownComponent inProgress={inProgress} text={text} />}
        {children}
      </ChatSlotsProvider>
    </BoxStyled>
  );
}

export default ChatMarkdown;
