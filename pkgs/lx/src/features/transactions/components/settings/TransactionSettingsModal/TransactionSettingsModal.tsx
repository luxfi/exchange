import { TransactionSettingsModalInterface } from '@l.x/lx/src/features/transactions/components/settings/TransactionSettingsModal/TransactionSettingsModalInterface'
import { TransactionSettingsModalWallet } from '@l.x/lx/src/features/transactions/components/settings/TransactionSettingsModal/TransactionSettingsModalWallet'
import { TransactionSettingsModalProps } from '@l.x/lx/src/features/transactions/components/settings/TransactionSettingsModal/types'
import { isWebApp } from '@l.x/utils/src/platform'

export function TransactionSettingsModal(props: TransactionSettingsModalProps): JSX.Element {
  if (isWebApp) {
    return <TransactionSettingsModalInterface {...props} />
  }
  return <TransactionSettingsModalWallet {...props} />
}
