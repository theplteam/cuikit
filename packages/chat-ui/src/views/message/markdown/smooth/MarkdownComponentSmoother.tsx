import * as React from 'react';
import MarkdownTexts from '../MessageMarkdownTexts';
import clsx from 'clsx';
import { chatClassNames } from '../../../core/chatClassNames';
import { checkRtlText } from '../../../utils/checkRtlText';

type Props = React.PropsWithChildren<{
  inProgress: boolean;
  component: React.JSXElementConstructor<any>;
  componentProps: any;
}>;

const MarkdownComponentSmoother: React.FC<Props> = ({ inProgress, children, component, componentProps }) => {
  const isRtl = checkRtlText(`${children}`);

  return (
    <MarkdownTexts
      component={component}
      inProgress={inProgress}
      componentProps={{
        ...componentProps,
        className: clsx(componentProps?.className, {
          [chatClassNames.markdownSmoothedPending]: inProgress,
          [chatClassNames.markdownRtlAlign]: isRtl,
        })
      }}
    >
      {children}
    </MarkdownTexts>
  );
}

export default MarkdownComponentSmoother;
