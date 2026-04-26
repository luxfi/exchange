// Web stub for react-native-reanimated.
//
// All animation work on web goes through CSS transitions or Tamagui's
// own animation system; reanimated is mobile-only here. Source files
// that actually use reanimated are .native.tsx and excluded from the
// web build by Vite's platform-extension resolution.
//
// What's left importing reanimated on web is a tiny set:
//   • apps/web/src/index.tsx → configureReanimatedLogger()
//   • pkgs/lx/.../modalConstants.tsx → Easing
//   • pkgs/lx/.../ModalProps.tsx    → type SharedValue
//
// This stub provides exactly those — no broken-fork dependency, no
// JSX-in-.js packaging bugs to transpile around.

export type SharedValue<T> = { value: T }

export function configureReanimatedLogger(_options?: unknown): void {
  // no-op — web has no reanimated runtime to configure
}

const linear = (t: number) => t
const ease = (t: number) => t * t * (3 - 2 * t)

export const Easing = {
  linear,
  ease,
  quad: (t: number) => t * t,
  cubic: (t: number) => t * t * t,
  in: (fn: (t: number) => number) => fn,
  out: (fn: (t: number) => number) => (t: number) => 1 - fn(1 - t),
  inOut: (fn: (t: number) => number) => (t: number) => (t < 0.5 ? fn(2 * t) / 2 : 1 - fn(2 * (1 - t)) / 2),
  bezier: (_a: number, _b: number, _c: number, _d: number) => linear,
  bezierFn: (_a: number, _b: number, _c: number, _d: number) => linear,
  steps: (_n: number, _modifier?: 'jump-start' | 'jump-end' | 'jump-none' | 'jump-both') => linear,
  poly: (_n: number) => linear,
  sin: (t: number) => Math.sin((t * Math.PI) / 2),
  circle: (t: number) => 1 - Math.sqrt(1 - t * t),
  exp: (t: number) => Math.pow(2, 10 * (t - 1)),
  back: () => (t: number) => t * t * (2.7 * t - 1.7),
  bounce: (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * Math.pow(1 - t, 4)),
  elastic: () => linear,
}

export const Extrapolate = { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' } as const
export const Extrapolation = Extrapolate

export function useSharedValue<T>(initial: T): SharedValue<T> {
  return { value: initial }
}
export function useDerivedValue<T>(fn: () => T): SharedValue<T> {
  return { value: fn() }
}
export function useAnimatedStyle<T>(fn: () => T): T {
  return fn()
}
export function useAnimatedProps<T>(fn: () => T): T {
  return fn()
}
export function withTiming<T>(value: T): T {
  return value
}
export function withSpring<T>(value: T): T {
  return value
}
export function withRepeat<T>(value: T): T {
  return value
}
export function withSequence<T>(...values: T[]): T {
  return values[values.length - 1]
}
export function withDelay<T>(_delay: number, value: T): T {
  return value
}
export function interpolate(_value: number, _input: readonly number[], output: readonly number[]): number {
  return output[0] ?? 0
}
export function runOnJS<F extends (...args: unknown[]) => unknown>(fn: F): F {
  return fn
}
export function runOnUI<F extends (...args: unknown[]) => unknown>(fn: F): F {
  return fn
}

export const FadeIn = { duration: () => FadeIn }
export const FadeOut = { duration: () => FadeOut }

const Animated = {
  View: 'div',
  Text: 'span',
  Image: 'img',
  ScrollView: 'div',
  createAnimatedComponent: <T,>(component: T): T => component,
}
export default Animated
