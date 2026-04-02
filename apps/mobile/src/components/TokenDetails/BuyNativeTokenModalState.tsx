import { UniverseChainId } from '@luxexchange/lx/src/features/chains/types'

export interface BuyNativeTokenModalState {
  chainId: UniverseChainId
  currencyId: string
}
