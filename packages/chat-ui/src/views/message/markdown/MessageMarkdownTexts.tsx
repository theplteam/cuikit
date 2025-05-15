import * as React from 'react';
import { useChildrenSmootherParser } from './smooth/useChildrenSmootherParser';

type Props<T> = React.PropsWithChildren<{
  componentProps: T;
  component: React.JSXElementConstructor<T>;
  inProgress: boolean;
}>;

const MessageMarkdownTexts: React.FC<Props<any>> = ({ children, inProgress, componentProps, component }) => {
  const [slots] = React.useState(() => ({ component }));
  const parser = useChildrenSmootherParser();

  const parsedContent = React.useMemo(
    () => inProgress ? parser(children) : children,
    [children, inProgress]
  );

  return (
    <slots.component {...componentProps}>
      {parsedContent}
    </slots.component>
  );
}

export default React.memo(MessageMarkdownTexts);
