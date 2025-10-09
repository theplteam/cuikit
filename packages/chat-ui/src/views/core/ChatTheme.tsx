import * as React from 'react';
import { createTheme, PaletteOptions, Theme, ThemeProvider } from '@mui/material';
import { ThemeProvider as StyledProvider } from '@mui/material/styles';
import { createBreakpoints } from '@mui/system';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

export type ThemeProps = React.PropsWithChildren<{
  userTheme?: Theme, mode?: 'light' | 'dark',
  lightPalette?: Omit<PaletteOptions, 'mode'>,
  darkPalette?: Omit<PaletteOptions, 'mode'>,
}>;

const defaultTheme = createTheme({
  breakpoints: createBreakpoints({
    values: {
      xs: 0,
      sm: 650,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  }),
});

const ChatTheme: React.FC<ThemeProps> = ({ children, userTheme, mode = 'light', lightPalette, darkPalette }) => {
  const emotionCache = React.useMemo(() => {
    const cache = createCache({ key: 'css', prepend: true });
    cache.compat = true;
    return cache;
  }, []);

  const palette: { light: PaletteOptions, dark: PaletteOptions } = React.useMemo(() => ({
    light: {
      mode: "light",
      background: { default: "#fff", paper: "#fff" },
      secondary: {
        main: "#f5f5f5",
        light: "rgb(247, 247, 247)",
        dark: "rgb(171, 171, 171)",
      },
      ...lightPalette,
    },
    dark: {
      mode: "dark",
      background: { default: "#121212", paper: "#121212" },
      secondary: {
        main: "#1b1d1c",
        light: "rgb(72, 74, 73)",
        dark: "rgb(18, 20, 19)",
      },
      ...darkPalette,
    },
  }), [lightPalette, darkPalette]);

  const chatTheme = React.useMemo(() => (
    createTheme({ ...defaultTheme, palette: palette[mode] })
  ), [mode]);

  const theme =  userTheme ?? chatTheme;

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <StyledProvider theme={theme}>
          {children}
        </StyledProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default React.memo(ChatTheme);
