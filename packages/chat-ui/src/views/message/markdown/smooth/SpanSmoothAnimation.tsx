import * as React from 'react';
import { chatClassNames } from '../../../core/chatClassNames';

const SpanSmoothAnimation: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <span className={chatClassNames.markdownSmoothedPending}>
      {children}
    </span>
  );
}

export default React.memo(SpanSmoothAnimation);
