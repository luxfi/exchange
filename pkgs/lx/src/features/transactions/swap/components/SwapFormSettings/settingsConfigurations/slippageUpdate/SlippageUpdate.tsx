import { Platform } from '@l.x/lx/src/features/platforms/types/Platform'
import type { TransactionSettingConfig } from '@l.x/lx/src/features/transactions/components/settings/types'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

export const SlippageUpdate: TransactionSettingConfig = {
  renderTitle: (t) => t('swap.slippage.settings.title'),
  applicablePlatforms: [Platform.EVM, Platform.SVM],
  Control() {
    throw new PlatformSplitStubError('Slippage')
  },
}
