import * as React from 'react';
import MarkdownTexts from '../MessageMarkdownTexts';
import { ChatViewConstants } from '../../../ChatViewConstants';
import clsx from 'clsx';

type Props = React.PropsWithChildren<{
  inProgress: boolean;
  component: React.JSXElementConstructor<any>;
  componentProps: any;
}>;

const MarkdownComponentSmoother: React.FC<Props> = ({ inProgress, children, component, componentProps }) => {
  return (
    <MarkdownTexts
      component={component}
      inProgress={inProgress}
      componentProps={{
        ...componentProps,
        className: clsx(componentProps?.className, { [ChatViewConstants.TEXT_SMOOTH_CLASSNAME_PENDING]: inProgress })
      }}
    >
      {children}
    </MarkdownTexts>
  );
}

export default MarkdownComponentSmoother;
