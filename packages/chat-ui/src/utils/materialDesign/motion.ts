const duration = {
  short1: "50ms",
  short2: "100ms",
  short3: "150ms",
  short4: "200ms",
  medium1: "250ms",
  medium2: "300ms",
  medium3: "350ms",
  medium4: "400ms",
  long1: "450ms",
  long2: "500ms",
  long3: "550ms",
  long4: "600ms",
  extraLong1: "700ms",
  extraLong2: "800ms",
  extraLong3: "900ms",
  extraLong4: "1000ms"
} as const;

export const motion = {
  duration,
} as const;

export type M3SysMotion = typeof motion;
