import type { AnimationKeys } from 'tamagui'

// Animation delay keys matching the pattern in animations/index.ts
// Uses the format '200msDelay-{delay}' where delay is in ms
// The return type is AnimationKeys to ensure compatibility with Tamagui components

// maintain alignment with animations defined in animations/index.ts
const DELAY_VALUES = [0, 50, 100, 150, 200, 250, 300, 350, 400] as const
const _DEFAULT_ANIMATION_DELAY: (typeof DELAY_VALUES)[number] = 0

const getDelayValue = (delay: number): AnimationKeys => `200msDelay-${delay}` as AnimationKeys

/**
 * Returns an animation key for the given index that corresponds to a 200ms animation
 * with incremental delays (0ms, 50ms, 100ms, etc.)
 */
export const get200MsAnimationDelayFromIndex = (index: number): AnimationKeys | undefined => {
  const delay = DELAY_VALUES[index]
  if (delay === undefined) {
    return undefined
  }
  return getDelayValue(delay)
}
