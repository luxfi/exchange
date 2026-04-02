import { DeviceLocale } from '@l.x/utils/src/device/constants'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

export function getDeviceLocales(): DeviceLocale[] {
  throw new PlatformSplitStubError('getDeviceLocales')
}
