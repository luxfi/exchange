import type { UsePlatformBasedValue } from '@l.x/lx/src/utils/usePlatformBasedValue'

export function usePlatformBasedValue<T>({ defaultValue, mobile }: UsePlatformBasedValue<T>): T {
  return mobile?.defaultValue ?? defaultValue
}
