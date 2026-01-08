import type { PropsWithChildren } from 'react'
import { createTransactionSettingsStore } from 'lx/src/features/transactions/components/settings/stores/transactionSettingsStore/createTransactionSettingsStore'
import { TransactionSettingsStoreContextProvider } from 'lx/src/features/transactions/components/settings/stores/transactionSettingsStore/TransactionSettingsStoreContextProvider'

const lpSettingsStore = createTransactionSettingsStore()
export function LPTransactionSettingsStoreContextProvider({
  autoSlippageTolerance,
  children,
}: PropsWithChildren<{ autoSlippageTolerance?: number }>): JSX.Element {
  return (
    <TransactionSettingsStoreContextProvider store={lpSettingsStore} autoSlippageTolerance={autoSlippageTolerance}>
      {children}
    </TransactionSettingsStoreContextProvider>
  )
}
