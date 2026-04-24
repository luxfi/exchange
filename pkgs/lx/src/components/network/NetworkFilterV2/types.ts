import type { UniverseChainId } from '@l.x/lx/src/features/chains/types'

export interface NetworkSelectorOption {
  chainId: UniverseChainId
  label: string
  balanceUSD: number
}

export interface TieredNetworkOptions {
  withBalances: NetworkSelectorOption[]
  otherNetworks: NetworkSelectorOption[]
}
