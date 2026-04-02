import { Platform } from 'lx/src/features/platforms/types/Platform'
import type { TransactionSettingConfig } from 'lx/src/features/transactions/components/settings/types'
import { PlatformSplitStubError } from 'utilities/src/errors'

/**
 * Base implementation of the slippage setting.
 * For the swap-specific implementation, see SwapFormSettings.
 */
export const Slippage: TransactionSettingConfig = {
  renderTitle: (t) => t('swap.slippage.settings.title'),
  applicablePlatforms: [Platform.EVM, Platform.SVM],
  Control() {
    throw new PlatformSplitStubError('Slippage')
  },
  Warning() {
    throw new PlatformSplitStubError('Slippage')
  },
}
