import { ChatViewConstants } from '../ChatViewConstants';
import { useChatContext } from './ChatGlobalContext';
import type { ChatSpeed } from './useChatProps';

export type ResolvedSpeed = {
  typing: number;
  stagger: number;
  fade: number;
};

// Resolves the public `speed` object (with the deprecated `typingSpeed` fallback) into
// concrete numbers, applying defaults. Single source of truth so the CSS fade duration,
// the stagger, and the button trigger all agree.
export const resolveSpeed = (speed?: ChatSpeed, typingSpeed?: number): ResolvedSpeed => {
  const typing = speed?.typing ?? typingSpeed ?? ChatViewConstants.TEXT_SMOOTH_ANIMATION_DURATION_MS;

  return {
    typing,
    stagger: speed?.stagger ?? ChatViewConstants.TEXT_SMOOTH_STAGGER_STEP_MS,
    // Left equal to `typing` until it would make a single word linger: a slow arrival wave
    // is usually what a large `typing` is asking for, while a multi-second fade just leaves
    // half the screen translucent.
    fade: speed?.fade ?? Math.min(typing, ChatViewConstants.TEXT_SMOOTH_FADE_MAX_MS),
  };
};

export const useResolvedSpeed = (): ResolvedSpeed => {
  const { speed, typingSpeed } = useChatContext();
  return resolveSpeed(speed, typingSpeed);
};
