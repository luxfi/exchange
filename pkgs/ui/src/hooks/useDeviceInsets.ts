import type { EdgeInsets } from 'react-native-safe-area-context'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

export function useDeviceInsets(): EdgeInsets {
  throw new PlatformSplitStubError('useDeviceInsets')
}
