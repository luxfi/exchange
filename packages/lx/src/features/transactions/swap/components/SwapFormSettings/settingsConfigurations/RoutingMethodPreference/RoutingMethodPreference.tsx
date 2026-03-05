import { Platform } from 'lx/src/features/platforms/types/Platform'
import type { TransactionSettingConfig } from 'lx/src/features/transactions/components/settings/types'
import { RoutingMethodPreferenceControl } from 'lx/src/features/transactions/swap/components/SwapFormSettings/settingsConfigurations/RoutingMethodPreference/RoutingMethodPreferenceControl'
import { RoutingMethodPreferenceScreen } from 'lx/src/features/transactions/swap/components/SwapFormSettings/settingsConfigurations/RoutingMethodPreference/RoutingMethodPreferenceScreen'

export const RoutingMethodPreference: TransactionSettingConfig = {
  renderTitle: (t) => t('swap.settings.routingMethod.title'),
  applicablePlatforms: [Platform.EVM],
  Control() {
    return <RoutingMethodPreferenceControl />
  },
  Screen() {
    return <RoutingMethodPreferenceScreen />
  },
}
