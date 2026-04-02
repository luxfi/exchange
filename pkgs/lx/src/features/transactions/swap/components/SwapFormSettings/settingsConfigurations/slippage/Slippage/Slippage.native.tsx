import { TradingApi } from '@l.x/api'
import { Platform } from 'lx/src/features/platforms/types/Platform'
import { SlippageWarning } from 'lx/src/features/transactions/components/settings/settingsConfigurations/slippage/SlippageWarning'
import type { TransactionSettingConfig } from 'lx/src/features/transactions/components/settings/types'
import { SlippageControl } from 'lx/src/features/transactions/swap/components/SwapFormSettings/settingsConfigurations/slippage/SlippageControl/SlippageControl'
import { SlippageScreenNative } from 'lx/src/features/transactions/swap/components/SwapFormSettings/settingsConfigurations/slippage/SlippageScreenNative'

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
    return <SlippageControl saveOnBlur={false} />
  },
  Screen() {
    return <SlippageScreenNative />
  },
  Warning() {
    return <SlippageWarning />
  },
}
