import { DdSdkReactNative } from '@datadog/mobile-react-native'
import { getUniqueIdSync } from 'react-native-device-info'
<<<<<<< HEAD
import { MobileUserPropertyName } from '@l.x/lx/src/features/telemetry/user'

export function setDatadogUserWithUniqueId(activeAddress: Maybe<Address>, luxIdentifier?: string | null): void {
  DdSdkReactNative.setUser({
    id: getUniqueIdSync(),
    ...(activeAddress ? { [MobileUserPropertyName.ActiveWalletAddress]: activeAddress } : {}),
    ...(luxIdentifier ? { [MobileUserPropertyName.LuxIdentifier]: luxIdentifier } : {}),
=======
import { MobileUserPropertyName } from 'uniswap/src/features/telemetry/user'

export function setDatadogUserWithUniqueId(activeAddress: Maybe<Address>, uniswapIdentifier?: string | null): void {
  DdSdkReactNative.setUser({
    id: getUniqueIdSync(),
    ...(activeAddress ? { [MobileUserPropertyName.ActiveWalletAddress]: activeAddress } : {}),
    ...(uniswapIdentifier ? { [MobileUserPropertyName.UniswapIdentifier]: uniswapIdentifier } : {}),
>>>>>>> upstream/main
  }).catch(() => undefined)
}
