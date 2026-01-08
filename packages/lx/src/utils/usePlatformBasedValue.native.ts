import type { UsePlatformBasedValue } from 'lx/src/utils/usePlatformBasedValue'

export function usePlatformBasedValue<T>({ defaultValue, mobile }: UsePlatformBasedValue<T>): T {
  return mobile?.defaultValue ?? defaultValue
}
