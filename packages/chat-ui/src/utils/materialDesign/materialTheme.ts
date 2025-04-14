/** @deprecated - dont use */
export const materialTheme = {
  body: {
    small: {
      fontSize: "0.75rem",
      lineHeight: "1rem",
      fontWeight: 400,
    },
    medium: {
      fontSize: "0.875rem",
      lineHeight: '1.25rem',
      letterSpacing: '0.25px',
      fontWeight: 400,
    },
    mediumArticle: {
      fontSize: "0.937rem",
      lineHeight: '1.43rem',
      letterSpacing: '0.25px',
      fontWeight: 400,
    },
    large: {
      fontSize: "1rem",
      lineHeight: '1.5rem',
      fontWeight: 400,
    }
  },
  display: {
    small: {
      fontSize: "2.25rem",
      lineHeight: 2.75,
      fontWeight: 400,
    },
    medium: {
      fontSize: "2.8125rem",
      lineHeight: 3.25,
      fontWeight: 400,
    },
    large: {
      fontSize: "3.5625rem",
      lineHeight: 4,
      fontWeight: 400,
    }
  },
  headline: {
    small: {
      fontSize: "1.5rem",
      lineHeight: '2rem',
      fontWeight: 400,
    },
    medium: {
      fontSize: "1.75rem",
      lineHeight: '2.25rem',
      fontWeight: 400,
    },
    large: {
      fontSize: "2rem",
      lineHeight: '2.5rem',
      fontWeight: 400,
    }
  },
  label: {
    small: {
      fontSize: "0.6875rem",
      lineHeight: 1,
      fontWeight: 500,
    },
    medium: {
      fontSize: "0.75rem",
      lineHeight: 1,
      fontWeight: 500,
    },
    large: {
      fontSize: "0.875rem",
      lineHeight: 1.25,
      fontWeight: 500,
    }
  },
  title: {
    small: {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      fontWeight: 500,
      letterSpacing: '0.1px',
    },
    medium: {
      fontSize: "1rem",
      lineHeight: "1.5rem",
      fontWeight: 500,
      letterSpacing: '0.15px',
    },
    large: {
      fontSize: "1.375rem", // 22px
      lineHeight: "1.75rem",
      fontWeight: 400,
      letterSpacing: 0,
    }
  },
  state: {
    layers: {
      light: {
        onSurfaceOpacity008: 'rgba(24, 28, 32, 0.12)',
      }
    }
  }
};

export type MaterialThemeType = typeof materialTheme;
export type TypographyKeys = `${Exclude<keyof MaterialThemeType, 'state'>}.${'small' | 'medium' | 'large'}` | 'body.mediumArticle';
