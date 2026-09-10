import { styled } from '@mui/material/styles';

/**
 * Positioning wrapper for a virtualized row or group header.
 *
 * Only used when virtualization is on — the default branch renders rows in
 * normal flow with no wrapper at all, which is what keeps its DOM identical to
 * previous releases.
 *
 * Deliberately carries no `position`: that, along with `top`, `transform` and
 * `height`, is per-row dynamic state and goes through the inline `style` prop so
 * it never reaches emotion. Baking `position: absolute` into the class would
 * also fight `TimeTextWrapper`, whose default is `position: sticky`.
 */
const ThreadListRowRoot = styled('div')({
  left: 0,
  width: '100%',
});

export default ThreadListRowRoot;
