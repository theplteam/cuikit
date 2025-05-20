import * as React from 'react';
import clsx from 'clsx';
import { markdownComponentsMemoCallback } from './markdownComponentsMemoCallback';
import { chatClassNames } from '../../../core/chatClassNames';

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
        { [chatClassNames.markdownSmoothedPending]: inProgress }
      )}
    >
      {children}
    </otherProps.component>
  );
}

export default React.memo(MarkdownLazyComponentSmoother, markdownComponentsMemoCallback);
