import { getAccount } from '@wagmi/core'
import { AccountType } from '@l.x/lx/src/features/accounts/types'
import { createEVMWalletService } from '@l.x/lx/src/features/wallet/services/createEVMWalletService'
import type { WalletService } from '@l.x/lx/src/features/wallet/services/IWalletService'
import { WalletMeta } from '@l.x/lx/src/features/wallet/types/WalletMeta'
import { wagmiConfig } from '~/components/Web3Provider/wagmiConfig'

export function getExternalEVMWalletService(): WalletService {
  return createEVMWalletService({ getWalletMeta: getWagmiWalletMeta, getAccountType: () => AccountType.SignerMnemonic })
}

function getWagmiWalletMeta(): WalletMeta {
  const { connector } = getAccount(wagmiConfig)

  return {
    id: connector?.id ?? '',
    name: connector?.name,
    icon: connector?.icon,
  }
}
