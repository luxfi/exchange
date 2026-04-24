import { Platform } from '@l.x/lx/src/features/platforms/types/Platform'
import type { TransactionSettingConfig } from '@l.x/lx/src/features/transactions/components/settings/types'
import { NotImplementedError } from '@l.x/utils/src/errors'

export const Deadline: TransactionSettingConfig = {
  applicablePlatforms: [Platform.EVM],
  renderTitle: () => {
    throw new NotImplementedError('Deadline > renderTitle')
  },
  Control() {
    throw new NotImplementedError('Deadline > Control')
  },
  Warning() {
    throw new NotImplementedError('Deadline > Warning')
  },
}
