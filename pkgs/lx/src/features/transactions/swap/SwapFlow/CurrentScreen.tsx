import type { TransactionSettingConfig } from '@l.x/lx/src/features/transactions/components/settings/types'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

export function CurrentScreen(_props: {
  settings: TransactionSettingConfig[]
  onSubmitSwap?: () => Promise<void> | void
  tokenColor?: string
}): JSX.Element {
  throw new PlatformSplitStubError('CurrentScreen')
}
