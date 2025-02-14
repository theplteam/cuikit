import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createBreakpoints } from '@mui/system';

type Props = React.PropsWithChildren<{}>;


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
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}

export default ChatTheme;
