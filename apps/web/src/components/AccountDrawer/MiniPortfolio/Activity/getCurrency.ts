import { apolloClient } from 'appGraphql/data/apollo/client'
import { gqlTokenToCurrencyInfo } from 'appGraphql/data/types'
import { Currency } from '@luxamm/sdk-core'
import { GraphQLApi } from '@luxfi/api'
import { COMMON_BASES } from 'lx/src/constants/routing'
import { nativeOnChain } from 'lx/src/constants/tokens'
import { toGraphQLChain } from 'lx/src/features/chains/utils'
import { CurrencyId } from 'lx/src/types/currency'
import { areAddressesEqual } from 'lx/src/utils/addresses'
import { currencyIdToAddress, currencyIdToChain, isNativeCurrencyAddress } from 'lx/src/utils/currencyId'

export async function getCurrencyFromCurrencyId(currencyId: CurrencyId): Promise<Currency | undefined> {
  // Split currencyId and confirm validity
  const chainId = currencyIdToChain(currencyId)
  const address = currencyIdToAddress(currencyId)
  if (!chainId) {
    return undefined
  }

  // Handle native currency
  const isNative = isNativeCurrencyAddress(chainId, address)
  if (isNative) {
    return nativeOnChain(chainId)
  }

  // Handle common bases
  const commonBase = COMMON_BASES[chainId].find(
    (base) =>
      base.currency.isToken &&
      areAddressesEqual({
        addressInput1: { address: base.currency.address, chainId: base.currency.chainId },
        addressInput2: { address, chainId },
      }),
  )
  if (commonBase) {
    return commonBase.currency
  }

  // Query for token from graphql
  const { data } = await apolloClient.query<GraphQLApi.TokenQuery>({
    query: GraphQLApi.TokenDocument,
    variables: {
      address,
      chain: toGraphQLChain(chainId),
    },
  })
  return gqlTokenToCurrencyInfo(data.token as GraphQLApi.Token)?.currency
}
