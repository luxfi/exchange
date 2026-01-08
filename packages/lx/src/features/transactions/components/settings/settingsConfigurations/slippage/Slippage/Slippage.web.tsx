import { Platform } from 'lx/src/features/platforms/types/Platform'
import { SlippageControl } from 'lx/src/features/transactions/components/settings/settingsConfigurations/slippage/SlippageControl/SlippageControl.web'
import { SlippageWarning } from 'lx/src/features/transactions/components/settings/settingsConfigurations/slippage/SlippageWarning'
import {
  type TransactionSettingConfig,
  TransactionSettingId,
} from 'lx/src/features/transactions/components/settings/types'

export const Slippage: TransactionSettingConfig = {
  applicablePlatforms: [Platform.EVM, Platform.SVM],
  renderTitle: (t) => t('swap.slippage.settings.title'),
  renderTooltip: (t) => t('swap.settings.slippage.description'),
  settingId: TransactionSettingId.SLIPPAGE,
  Control() {
    return <SlippageControl saveOnBlur={false} />
  },
  Warning() {
    return <SlippageWarning />
  },
}
