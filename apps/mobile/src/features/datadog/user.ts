import { DdSdkReactNative } from '@datadog/mobile-react-native'
import { getUniqueIdSync } from 'react-native-device-info'
import { MobileUserPropertyName } from '@luxexchange/lx/src/features/telemetry/user'

export function setDatadogUserWithUniqueId(activeAddress: Maybe<Address>, luxIdentifier?: string | null): void {
  DdSdkReactNative.setUser({
    id: getUniqueIdSync(),
    ...(activeAddress ? { [MobileUserPropertyName.ActiveWalletAddress]: activeAddress } : {}),
    ...(luxIdentifier ? { [MobileUserPropertyName.LuxIdentifier]: luxIdentifier } : {}),
  }).catch(() => undefined)
}
