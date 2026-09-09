export type MessageNavOptions = {
  /**
   * Fisheye rail at the right edge of the thread. Shown from the `md` breakpoint up,
   * where there is a pointer to hover it with.
   */
  desktop?: boolean;
  /**
   * Button above the composer opening a list of the user messages. Shown below the
   * `md` breakpoint, where the rail cannot be hovered or dragged.
   */
  mobile?: boolean;
};

/**
 * `true` turns message navigation on everywhere; an object turns on exactly the
 * listed sides, so `{ desktop: true }` leaves touch-sized screens untouched.
 */
export type MessageNavProp = boolean | MessageNavOptions;

export type ResolvedMessageNav = {
  desktop: boolean;
  mobile: boolean;
};

export const resolveMessageNav = (value?: MessageNavProp): ResolvedMessageNav => {
  if (!value) return { desktop: false, mobile: false };

  if (value === true) return { desktop: true, mobile: true };

  return { desktop: !!value.desktop, mobile: !!value.mobile };
};
