import * as React from 'react';
import { useHistoryContext } from '../core/history/HistoryContext';
import ChatHistory from './ChatHistory';
import { useTablet } from '../../ui/Responsive';
import clsx from 'clsx';
import { historyClassNames } from '../core/history/historyClassNames';

export type HistoryContainerProps = {
  className?: string,
};

const HistoryContainer: React.FC<HistoryContainerProps> = ({ className }) => {
  const { slots, slotProps } = useHistoryContext();
  const isTablet = useTablet();

  return (
    <slots.historyContainer
      width="100%"
      height="100%"
      className={clsx(historyClassNames.container, className)}
      sx={{
        maxWidth: isTablet ? 220 : 360,
        backgroundColor: (theme) => theme.palette.background.paper,
        color: (theme) => theme.palette.text.primary,
      }}
      {...slotProps.historyContainer}
    >
      <ChatHistory />
    </slots.historyContainer>
  );
};

export default HistoryContainer;
