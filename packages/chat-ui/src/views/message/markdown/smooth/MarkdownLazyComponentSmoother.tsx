import * as React from 'react';
import clsx from 'clsx';
import { ChatViewConstants } from '../../../ChatViewConstants';
import { markdownComponentsMemoCallback } from './markdownComponentsMemoCallback';

type Props = React.PropsWithChildren<{
  component: React.ElementType;
  componentProps?: React.ComponentProps<any>;
  inProgress: boolean;
}>;

const MarkdownLazyComponentSmoother: React.FC<Props> = ({ componentProps, inProgress, children, ...otherProps }) => {
  return (
    <otherProps.component
      {...componentProps}
      className={clsx(
        componentProps?.className,
        { [ChatViewConstants.TEXT_SMOOTH_CLASSNAME_PENDING]: inProgress }
      )}
    >
      {children}
    </otherProps.component>
  );
}

export default React.memo(MarkdownLazyComponentSmoother, markdownComponentsMemoCallback);
