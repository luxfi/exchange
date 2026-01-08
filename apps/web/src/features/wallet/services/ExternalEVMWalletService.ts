import { getAccount } from '@wagmi/core'
import { wagmiConfig } from 'components/Web3Provider/wagmiConfig'
import { AccountType } from 'lx/src/features/accounts/types'
import { createEVMWalletService } from 'lx/src/features/wallet/services/createEVMWalletService'
import type { WalletService } from 'lx/src/features/wallet/services/IWalletService'
import { WalletMeta } from 'lx/src/features/wallet/types/WalletMeta'

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
