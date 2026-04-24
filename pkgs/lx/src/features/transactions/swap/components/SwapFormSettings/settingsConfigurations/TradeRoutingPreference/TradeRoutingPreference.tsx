import { Platform } from '@l.x/lx/src/features/platforms/types/Platform'
import type { TransactionSettingConfig } from '@l.x/lx/src/features/transactions/components/settings/types'
import { TradeRoutingPreferenceControl } from '@l.x/lx/src/features/transactions/swap/components/SwapFormSettings/settingsConfigurations/TradeRoutingPreference/TradeRoutingPreferenceControl'
import { TradeRoutingPreferenceScreen } from '@l.x/lx/src/features/transactions/swap/components/SwapFormSettings/settingsConfigurations/TradeRoutingPreference/TradeRoutingPreferenceScreen'

export const TradeRoutingPreference: TransactionSettingConfig = {
  renderTitle: (t) => t('swap.settings.routingPreference.title'),
  applicablePlatforms: [Platform.EVM],
  Control() {
    return <TradeRoutingPreferenceControl />
  },
  Screen() {
    return <TradeRoutingPreferenceScreen />
  },
}
