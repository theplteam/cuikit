import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createBreakpoints } from '@mui/system';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

type Props = React.PropsWithChildren

const theme = createTheme({
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

const ChatTheme: React.FC<Props> = ({ children }) => {
  const emotionCache = createCache({ key: 'css', prepend: true });
  emotionCache.compat = true;

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}

export default React.memo(ChatTheme, () => true);
