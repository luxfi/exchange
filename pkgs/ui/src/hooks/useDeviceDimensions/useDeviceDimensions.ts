import { PlatformSplitStubError } from '@l.x/utils/src/errors'

export type DeviceDimensions = { fullHeight: number; fullWidth: number }

export function useDeviceDimensions(): DeviceDimensions {
  throw new PlatformSplitStubError('useDeviceDimensions')
}

export function useIsExtraLargeScreen(): boolean {
  throw new PlatformSplitStubError('useIsExtraLargeScreen')
}
