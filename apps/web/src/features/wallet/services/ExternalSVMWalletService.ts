import { useWallet as useSolanaWalletContext } from '@solana/wallet-adapter-react'
import { useMemo } from 'react'
<<<<<<< HEAD
import { AccountType } from '@l.x/lx/src/features/accounts/types'
import { Platform } from '@l.x/lx/src/features/platforms/types/Platform'
import type { WalletService } from '@l.x/lx/src/features/wallet/services/IWalletService'
import { WalletMeta } from '@l.x/lx/src/features/wallet/types/WalletMeta'
=======
import { AccountType } from 'uniswap/src/features/accounts/types'
import { Platform } from 'uniswap/src/features/platforms/types/Platform'
import type { WalletService } from 'uniswap/src/features/wallet/services/IWalletService'
import { WalletMeta } from 'uniswap/src/features/wallet/types/WalletMeta'
>>>>>>> upstream/main

export function useExternalSVMWalletService(): WalletService {
  const solanaWalletMeta = useSolanaWalletMeta()

  return useMemo(() => {
    return {
      getWallet(params) {
        const address = params.svmAddress

        if (address) {
          return {
            svmAccount: {
              platform: Platform.SVM,
              accountType: AccountType.SignerMnemonic,
              address,
              walletMeta: solanaWalletMeta,
            },
          }
        }

        return {
          svmAccount: undefined,
        }
      },
    }
  }, [solanaWalletMeta])
}

function useSolanaWalletMeta(): WalletMeta {
  const { wallet } = useSolanaWalletContext()
  const name = wallet?.adapter.name
  const icon = wallet?.adapter.icon

  return useMemo(() => ({ id: name ?? '', name, icon }), [name, icon])
}
