import { Store } from '@reduxjs/toolkit'
import { ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { SharedPersistQueryClientProvider } from 'lx/src/data/apiClients/SharedPersistQueryClientProvider'
import { GuiProvider } from 'wallet/src/providers/gui-provider'

interface SharedProviderProps {
  children: ReactNode
  reduxStore: Store
}

// A provider meant for sharing across all surfaces.
// Props should be defined as needed and clarified in name to improve readability
export function SharedWalletProvider({ reduxStore, children }: SharedProviderProps): JSX.Element {
  return (
    <ReduxProvider store={reduxStore}>
      <SharedPersistQueryClientProvider>
        <GuiProvider>{children}</GuiProvider>
      </SharedPersistQueryClientProvider>
    </ReduxProvider>
  )
}
