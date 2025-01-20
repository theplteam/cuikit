import * as React from 'react';

export type BoxRefType = React.MutableRefObject<HTMLDivElement | null>;

export const useElementRef = <T extends HTMLElement = HTMLDivElement>() => {
  return React.useRef<T | null>(null);
}

export const useElementRefState = <T extends HTMLElement = HTMLDivElement>() => {
  const [element, setElement] = React.useState<T | null>(null);

  return { element, setElement };
}
