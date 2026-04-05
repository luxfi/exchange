<<<<<<< HEAD
import { Deadline } from '@l.x/lx/src/features/transactions/components/settings/settingsConfigurations/deadline/Deadline/Deadline'
import type { TransactionSettingConfig } from '@l.x/lx/src/features/transactions/components/settings/types'
=======
import { Deadline } from 'uniswap/src/features/transactions/components/settings/settingsConfigurations/deadline/Deadline/Deadline'
import type { TransactionSettingConfig } from 'uniswap/src/features/transactions/components/settings/types'
>>>>>>> upstream/main

// default deadline setting is overridden to use a custom title
export const DeadlineOverride: TransactionSettingConfig = {
  ...Deadline,
  renderTitle: (t) => t('swap.deadline.settings.title'),
}
