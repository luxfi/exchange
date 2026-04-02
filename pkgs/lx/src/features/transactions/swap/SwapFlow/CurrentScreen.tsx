import type { TransactionSettingConfig } from 'lx/src/features/transactions/components/settings/types'
import { PlatformSplitStubError } from 'utilities/src/errors'

export function CurrentScreen(_props: {
  settings: TransactionSettingConfig[]
  onSubmitSwap?: () => Promise<void> | void
  tokenColor?: string
}): JSX.Element {
  throw new PlatformSplitStubError('CurrentScreen')
}
