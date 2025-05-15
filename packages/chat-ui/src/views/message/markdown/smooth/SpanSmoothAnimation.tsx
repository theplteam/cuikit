import * as React from 'react';
import { ChatViewConstants } from '../../../ChatViewConstants';

const SpanSmoothAnimation: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <span className={ChatViewConstants.TEXT_SMOOTH_CLASSNAME_PENDING}>
      {children}
    </span>
  );
}

export default React.memo(SpanSmoothAnimation);
