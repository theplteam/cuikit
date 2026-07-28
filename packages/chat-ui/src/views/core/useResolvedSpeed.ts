import { ChatViewConstants } from '../ChatViewConstants';
import { useChatContext } from './ChatGlobalContext';
import type { ChatSpeed } from './useChatProps';

export type ResolvedSpeed = {
  typing: number;
  stagger: number;
};

// Resolves the public `speed` object (with the deprecated `typingSpeed` fallback) into
// concrete numbers, applying defaults. Single source of truth so the CSS fade duration,
// the stagger, and the button trigger all agree.
export const resolveSpeed = (speed?: ChatSpeed, typingSpeed?: number): ResolvedSpeed => ({
  typing: speed?.typing ?? typingSpeed ?? ChatViewConstants.TEXT_SMOOTH_ANIMATION_DURATION_MS,
  stagger: speed?.stagger ?? ChatViewConstants.TEXT_SMOOTH_STAGGER_STEP_MS,
});

export const useResolvedSpeed = (): ResolvedSpeed => {
  const { speed, typingSpeed } = useChatContext();
  return resolveSpeed(speed, typingSpeed);
};
