import { AccountType } from 'lx/src/features/accounts/types'
import type { ProviderService } from '@luxfi/wallet/src/features/transactions/executeTransaction/services/providerService'
import { walletContextValue } from '@luxfi/wallet/src/features/wallet/context'
import type { SignerManager } from '@luxfi/wallet/src/features/wallet/signing/SignerManager'

export const createProviderService = (ctx: { getSignerManager: () => SignerManager }): ProviderService => {
  const providerManager = walletContextValue.providers

  const getProvider: ProviderService['getProvider'] = async (input) => {
    return providerManager.getProvider(input.chainId)
  }

  const getPrivateProvider: ProviderService['getPrivateProvider'] = async (input) => {
    if (input.account.type !== AccountType.SignerMnemonic) {
      throw new Error('Account must be a mnemonic account')
    }
    const signer = await ctx.getSignerManager().getSignerForAccount(input.account)
    return providerManager.getPrivateProvider(input.chainId, signer)
  }

  return {
    getProvider,
    getPrivateProvider,
  }
}
