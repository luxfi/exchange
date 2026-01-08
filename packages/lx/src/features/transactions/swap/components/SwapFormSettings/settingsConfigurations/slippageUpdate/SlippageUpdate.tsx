import { Platform } from 'lx/src/features/platforms/types/Platform'
import type { TransactionSettingConfig } from 'lx/src/features/transactions/components/settings/types'
import { PlatformSplitStubError } from 'utilities/src/errors'

export const SlippageUpdate: TransactionSettingConfig = {
  renderTitle: (t) => t('swap.slippage.settings.title'),
  applicablePlatforms: [Platform.EVM, Platform.SVM],
  Control() {
    throw new PlatformSplitStubError('Slippage')
  },
}
