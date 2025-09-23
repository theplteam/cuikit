import * as React from 'react';
import useEventListener from './useEventListener';

const useHover = (element: HTMLDivElement | null) => {
  const [hovered, setHovered] = React.useState(false);

  useEventListener("mouseover", () => setHovered(true), element);
  useEventListener("mouseout", () => setHovered(false), element);

  return { hovered,  setHovered };
}

export default useHover;
