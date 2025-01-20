export const materialDesignCorner = {
  // извините
  superExtraLarge: 32,
  extraLarge: 28,
  large: 16,
  medium: 12,
  small: 8,
  extraSmall: 4,
  noRounding: 'none',
} as const;

export type M3SysShapeCorner = typeof materialDesignCorner;
