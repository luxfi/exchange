import { Currency } from '@luxamm/sdk-core'
import { GraphQLApi } from '@luxfi/api'
import { NATIVE_CHAIN_ID } from 'constants/tokens'
import { normalizeTokenAddressForCache } from 'lx/src/data/cache'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { fromGraphQLChain } from 'lx/src/features/chains/utils'

export type CurrencyKey = string

export function buildCurrencyKey(chainId: UniverseChainId, address: string): CurrencyKey {
  // We normalize for compatibility/indexability between gql tokens and sdk currencies
  return `${chainId}-${normalizeTokenAddressForCache(address)}`
}

export function currencyKey(currency: Currency): CurrencyKey {
  return buildCurrencyKey(currency.chainId, currency.isToken ? currency.address : NATIVE_CHAIN_ID)
}

export function currencyKeyFromGraphQL(contract: {
  address?: string
  chain: GraphQLApi.Chain
  standard?: GraphQLApi.TokenStandard
}): CurrencyKey {
  const chainId = fromGraphQLChain(contract.chain)
  const address = contract.standard === GraphQLApi.TokenStandard.Native ? NATIVE_CHAIN_ID : contract.address
  if (!address) {
    throw new Error('Non-native token missing address')
  }
  if (!chainId) {
    throw new Error('Unsupported chain from pools query')
  }
  return buildCurrencyKey(chainId, address)
}
