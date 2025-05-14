import * as React from 'react';

const childrenToString = (children: React.ReactNode) =>
  React.Children.toArray(children).filter(v => typeof v === "string").join('-');

export const markdownComponentsMemoCallback = <P extends React.PropsWithChildren<{ inProgress: boolean }>>(prevProps: Readonly<P>, nextProps: Readonly<P>) => {
  return prevProps.inProgress === nextProps.inProgress && childrenToString(prevProps.children) === childrenToString(nextProps.children);
}
