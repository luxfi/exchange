import type { TransactionSettingConfig } from '@l.x/lx/src/features/transactions/components/settings/types'
import { Slippage } from '@l.x/lx/src/features/transactions/swap/components/SwapFormSettings/settingsConfigurations/slippage/Slippage/Slippage'
import { SlippageControl } from '@l.x/lx/src/features/transactions/swap/components/SwapFormSettings/settingsConfigurations/slippage/SlippageControl/SlippageControl'

export const SlippageUpdate: TransactionSettingConfig = {
  ...Slippage,
  hideTitle: true,
  Control() {
    return <SlippageControl saveOnBlur={true} />
  },
}
