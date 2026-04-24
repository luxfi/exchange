import { TradingApi } from '@l.x/api'
import { Platform } from '@l.x/lx/src/features/platforms/types/Platform'
import type { TransactionSettingConfig } from '@l.x/lx/src/features/transactions/components/settings/types'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

export const Slippage: TransactionSettingConfig = {
  renderTitle: (t) => t('swap.slippage.settings.title'),
  applicablePlatforms: [Platform.EVM, Platform.SVM],
  inapplicableTradeRouting: [
    TradingApi.Routing.WRAP,
    TradingApi.Routing.UNWRAP,
    TradingApi.Routing.BRIDGE,
    TradingApi.Routing.LIMIT_ORDER,
  ],
  Control() {
    throw new PlatformSplitStubError('Slippage')
  },
  Warning() {
    throw new PlatformSplitStubError('Slippage')
  },
}
