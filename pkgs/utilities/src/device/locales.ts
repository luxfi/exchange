import { DeviceLocale } from '@luxfi/utilities/src/device/constants'
import { PlatformSplitStubError } from '@luxfi/utilities/src/errors'

export function getDeviceLocales(): DeviceLocale[] {
  throw new PlatformSplitStubError('getDeviceLocales')
}
