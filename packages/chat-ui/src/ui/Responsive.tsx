import { useTheme } from '@mui/material/styles';
import useMediaQuery, { UseMediaQueryOptions } from '@mui/material/useMediaQuery';
import React from 'react';
import { Breakpoint } from '@mui/system/createTheme/createBreakpoints';

export const useTablet = (options?: UseMediaQueryOptions) => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('md'), options);
};

export const useMobile = (options?: UseMediaQueryOptions) => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('sm'), options);
};

type UseBreakpoint = {
  (fnKey: 'between', breakpoint1: Breakpoint, breakpoint2: Breakpoint, options?: UseMediaQueryOptions): boolean;
  (fnKey: 'up' | 'down' | 'only', breakpoint: Breakpoint, options?: UseMediaQueryOptions, never?: never): boolean;
};

export const useBreakpoint: UseBreakpoint = (fnKey, breakpoint, breakpointOrOptions, options) => {
  const theme = useTheme();
  let args: Parameters<typeof useMediaQuery>;
  if (fnKey === 'between') {
    args = [
      theme.breakpoints.between(breakpoint, breakpointOrOptions as Breakpoint), options
    ];
  } else {
    args = [
      theme.breakpoints[fnKey](breakpoint), breakpointOrOptions as UseMediaQueryOptions
    ]
  }

  return useMediaQuery(...args);
};

export const HiddenMobile: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useMobile();
  return isMobile
    ? null
    // eslint-disable-next-line
    : <>{children}</>;
}

export const HiddenTablet: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isTablet = useTablet();
  return isTablet
    ? null
    // eslint-disable-next-line
    : <>{children}</>;
}

export const HiddenDesktop: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isTablet = useTablet();
  return isTablet
    // eslint-disable-next-line
    ? <>{children}</>
    : null;
}
