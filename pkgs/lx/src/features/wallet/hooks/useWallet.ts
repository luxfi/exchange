import { useMemo } from 'react'
import { useWalletContext } from 'lx/src/features/wallet/contexts/WalletProvider'
import { Wallet } from 'lx/src/features/wallet/types/Wallet'

export function useWallet(): Wallet {
  const context = useWalletContext()
  return useMemo(() => context.wallet, [context.wallet])
}
