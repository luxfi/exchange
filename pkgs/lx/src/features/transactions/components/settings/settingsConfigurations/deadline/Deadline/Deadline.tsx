import { Platform } from '@l.x/lx/src/features/platforms/types/Platform'
import { type TransactionSettingConfig } from '@l.x/lx/src/features/transactions/components/settings/types'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

/**
 * Base implementation of the deadline setting.
 * For the swap-specific implementation, see SwapFormSettings.
 */
export const Deadline: TransactionSettingConfig = {
  renderTitle: (t) => t('swap.deadline.settings.title.short'),
  applicablePlatforms: [Platform.EVM],
  Control() {
    throw new PlatformSplitStubError('Deadline')
  },
  Warning() {
    throw new PlatformSplitStubError('DeadlineWarning')
  },
}
