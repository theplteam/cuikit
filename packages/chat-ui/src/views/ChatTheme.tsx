import { M3SysMotion, motion } from '../utils/materialDesign/motion';
import { M3SysPalette, materialDesignSysPalette } from '../utils/materialDesign/palette';
import { M3SysShapeCorner, materialDesignCorner } from '../utils/materialDesign/shape';
import { elevation } from '../utils/materialDesign/elevation';
import { materialTheme, MaterialThemeType } from '../utils/materialDesign/materialTheme';
import { createBreakpoints } from '@mui/system';
import { createTheme, adaptV4Theme, ThemeProvider, StyledEngineProvider } from '@mui/material';
import { red } from '@mui/material/colors';
import * as React from 'react';

const playlinerPalette = {
  50: '#3db1e7',
  100: '#3db1e7',
  200: '#3db1e7',
  300: '#3db1e7',
  400: '#2798dd',
  500: '#2798dd',
  600: '#2798dd',
  700: '#2798dd',
  800: '#2b353f',
  900: '#2b353f',
  A100: '#ffffff',
  A200: '#d7edff',
  A400: '#a4d6ff',
  A700: '#8bcbff',
  contrastDefaultColor: 'dark',
};

export const playlinerPaletteSecondary = {
  50: '#e2f6ef',
  100: '#b7e8d7',
  200: '#87d9bd',
  300: '#57c9a2',
  400: '#33be8e',
  500: '#0fb27a',
  600: '#0dab72',
  700: '#0ba267',
  800: '#08995d',
  900: '#048a4a',
  A100: '#b6ffd8',
  A200: '#83ffbd',
  A400: '#50ffa2',
  A700: '#36ff94',
  contrastDefaultColor: 'light',
};

type CustomTheme = {
  m3: {
    sys: {
      motion: M3SysMotion,
      palette: M3SysPalette,
      shape: {
        corner: M3SysShapeCorner,
      },
    };
    elevation: Record<keyof typeof elevation, string>;
    materialTheme: MaterialThemeType,
  },
  searchContainer: {
    maxWidth: number,
  },
  calendar: {
    leftBlockZIndex: number,
  },
};

interface AdditionalTheme extends CustomTheme {
  appDrawer: {
    width: number;
  };
  middleBlock: {
    width: number;
  };
  appBar: {
    height: number;
    fullHeight: number;
    mobileToolsHeight: number;
  };
  textColor: string;
  news: {
    tagsTitleWidth: number;
  };
  rightBlock: {
    minWidth: number;
    maxWidth: number;
    backgroundColor: string;
  };
}

declare module '@mui/material/styles' {
  interface Theme extends AdditionalTheme {}
  interface DeprecatedThemeOptions extends AdditionalTheme {}
  interface BreakpointOverrides {
    lst: true;
  }
}

export const dateFormat = 'D MMMM YYYY';
export const APP_DRAWER_WITH = 240;
// не делать export! это можно достать через тему
const middleBlockWidth = 700;
const textColor = '#131313';
const theme = createTheme(adaptV4Theme({
  textColor,
  news: {
    tagsTitleWidth: 100,
  },
  m3: {
    sys: {
      motion,
      palette: materialDesignSysPalette,
      shape: {
        corner: materialDesignCorner,
      },
    },
    elevation,
    // typography,
    materialTheme,
  },
  searchContainer: {
    maxWidth: 750,
  },
  calendar: {
    leftBlockZIndex: 970,
  },
  palette: {
    primary: playlinerPalette,
    secondary: playlinerPaletteSecondary,
    error: red,
    contrastThreshold: 2.4,
  },
  appDrawer: {
    width: APP_DRAWER_WITH,
  },
  rightBlock: {
    minWidth: 300,
    maxWidth: 360,
    backgroundColor: materialDesignSysPalette.surfaceContainerLow,
  },
  middleBlock: {
    width: middleBlockWidth,
  },
  appBar: {
    height: 64,
    // вместе с border
    fullHeight: 65,
    mobileToolsHeight: 48,
  },
  typography: {

  },
  overrides: {
    MuiPaper: {
      root: {
        backgroundColor: 'white',
      },
    },
    MuiTypography: {
      h4: {
      },
      h5: {
      },
      h6: {
      },
      body1: {
        color: textColor,
      },
      body2: {
        color: textColor,
      },
      subtitle2: {
      },
      caption: {
        color: textColor,
      },
    },
    MuiButton: {
      root: {
        borderRadius: 100,
        textTransform: 'unset',
        boxShadow: 'none',
      },
      containedSecondary: {
        color: 'white',
        backgroundColor: playlinerPaletteSecondary[500],
        '&:hover': {
          backgroundColor: playlinerPaletteSecondary[600],
        },
      },
      outlinedSecondary: {
        color: playlinerPaletteSecondary[500],
        border: `1px solid  ${playlinerPaletteSecondary[600]}`,
        '&:hover': {
          border: `1px solid  ${playlinerPaletteSecondary[600]}`,
        },
      },
      sizeSmall: {
        padding: '4px 16px',
      },
    },
    MuiRadio: {
      root: {
        color: materialDesignSysPalette.primary,
        '&.Mui-checked': {
          color: materialDesignSysPalette.primary,
        },
      },
    },
    MuiLink: {
      root: {
        color: playlinerPaletteSecondary[700],
      }
    },
    MuiDivider: {
      root: {
        borderColor: materialDesignSysPalette.surfaceVariant,
      },
    },
  },
  breakpoints: createBreakpoints({
    values: {
      xs: 0,
      lst: 360,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  }),
}));

export const ChatTheme: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

