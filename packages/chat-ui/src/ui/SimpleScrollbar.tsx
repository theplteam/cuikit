import * as React from 'react';
import SimpleBar, { Props as SimpleBarProps } from 'simplebar-react';
import type SimpleBarCore from 'simplebar-core';
import 'simplebar-react/dist/simplebar.min.css';
import { styled } from '@mui/material/styles';

type Props = React.PropsWithChildren<{
  style?: React.CSSProperties;
  maxContent?: boolean;
}> & Omit<SimpleBarProps, 'style'>;

type SimpleBarClassesType = Readonly<{
  contentWrapper: string;
  content: string;
  track: string;
  hover: string;
  scrollbarVisibleBefore: string;
}>;

export const simpleBarClasses: SimpleBarClassesType = {
  contentWrapper: 'simplebar-content-wrapper',
  content: 'simplebar-content',
  track: 'simplebar-track',
  hover: 'simplebar-hover',
  scrollbarVisibleBefore: 'simplebar-visible:before',
};

const SimpleBarStyled = styled(SimpleBar, {
  shouldForwardProp: (propName) => propName !== 'maxContent'
})<{ maxContent?: boolean }>(({ maxContent, theme }) => ({
  [`& .${simpleBarClasses.contentWrapper}`]: {
    minWidth: maxContent ? 'max-content' : undefined,
  },

  [`& .${simpleBarClasses.track}`]: {
    [`& .${simpleBarClasses.scrollbarVisibleBefore}`]: {
      backgroundColor: theme.palette.action.active,
      opacity: 0.25,
      transition: 'opacity 0.3s'
    },
    [`&.${simpleBarClasses.hover}`]: {
      [`& .${simpleBarClasses.scrollbarVisibleBefore}`]: {
        opacity: 0.5,
      },
    },
  },
}));

/**
 * The ref receives the SimpleBarCore instance, so callers can reach the real
 * scroll node via `instance.getScrollElement()`.
 *
 * `...rest` must stay forwarded: `styled(SimpleScrollbar)` delivers its
 * generated class through `className`, and dropping it silently discards
 * every style a caller wraps this component with.
 */
const SimpleScrollbar = React.forwardRef<SimpleBarCore, Props>((
  { style, children, maxContent, ...rest },
  ref,
) => {
  return (
    <SimpleBarStyled
      ref={ref}
      forceVisible
      autoHide={false}
      maxContent={maxContent}
      style={style}
      {...rest}
    >
      {children}
    </SimpleBarStyled>
  );
});

SimpleScrollbar.displayName = 'SimpleScrollbar';

export default SimpleScrollbar;
