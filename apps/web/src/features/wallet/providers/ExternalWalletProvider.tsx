import { useWallet as useSolanaWalletContext } from '@solana/wallet-adapter-react'
import { FeatureFlags, useFeatureFlag } from '@luxfi/gating'
import { getExternalEVMWalletService } from 'features/wallet/services/ExternalEVMWalletService'
import { useExternalSVMWalletService } from 'features/wallet/services/ExternalSVMWalletService'
import { useAccount } from 'hooks/useAccount'
import { PropsWithChildren, useMemo } from 'react'
import { WalletProvider } from 'lx/src/features/wallet/contexts/WalletProvider'
import { createWalletService } from 'lx/src/features/wallet/services/createWalletService'

export function ExternalWalletProvider({ children }: PropsWithChildren): JSX.Element {
  const evmAccountAddress = useAccount().address

  const solanaEnabled = useFeatureFlag(FeatureFlags.Solana)
  const svmAccountAddress = useSolanaWalletContext().wallet?.adapter.publicKey?.toString() // toString is equal to toBase58

  const svmWalletService = useExternalSVMWalletService()
  const walletService = useMemo(
    () =>
      createWalletService({
        evmWalletService: getExternalEVMWalletService(),
        svmWalletService,
      }),
    [svmWalletService],
  )

  return (
    <WalletProvider
      walletService={walletService}
      evmAddress={evmAccountAddress}
      svmAddress={solanaEnabled ? svmAccountAddress : undefined}
    >
      {children}
    </WalletProvider>
  )
}
