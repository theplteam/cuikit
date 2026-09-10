/**
 * Single source of truth for the history list metrics.
 *
 * These numbers are consumed twice: by the CSS that lays the list out, and by
 * the virtualizer that positions rows without measuring them. Keep the two in
 * sync by importing from here rather than repeating the literals.
 */

/** Height of one thread row. Applied by ThreadListMapBlockAllStyled. */
export const HISTORY_ITEM_HEIGHT = 56;

/** Height of a time-group header. Applied by TimeTextWrapper. */
export const HISTORY_GROUP_HEADER_HEIGHT = 40;

/** Height of the mobile history drawer content area. */
export const HISTORY_DRAWER_HEIGHT = 500;
