import { Token } from '@luxamm/sdk-core'
import { GraphQLApi } from '@luxfi/api'
import { useMemo } from 'react'
import { OnchainItemListOptionType, TokenOption } from 'lx/src/components/lists/items/types'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { CurrencyInfo, TokenList } from 'lx/src/features/dataApi/types'
import { buildCurrencyId } from 'lx/src/utils/currencyId'

// Token list structure from tokens-lux/tokens.ts
interface TokenListToken {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI: string
  extensions?: Record<string, unknown>
}

interface TokensList {
  tokens: TokenListToken[]
}

// Lux/Zoo chain IDs that use local token list
const LUX_CHAIN_IDS = new Set([
  UniverseChainId.Lux,
  UniverseChainId.LuxDev,
  UniverseChainId.LuxTestnet,
  UniverseChainId.Zoo,
  UniverseChainId.ZooTestnet,
])

// Check if a chain should use Lux token list
export function isLuxChain(chainId: Maybe<UniverseChainId>): boolean {
  return chainId !== null && chainId !== undefined && LUX_CHAIN_IDS.has(chainId)
}

// Convert a raw token to TokenOption
function tokenListTokenToTokenOption(token: TokenListToken): TokenOption {
  const currency = new Token(
    token.chainId,
    token.address,
    token.decimals,
    token.symbol,
    token.name,
  )

  const currencyInfo: CurrencyInfo = {
    currency,
    currencyId: buildCurrencyId(token.chainId as UniverseChainId, token.address),
    logoUrl: token.logoURI || null,
    safetyInfo: {
      tokenList: TokenList.Default,
      protectionResult: GraphQLApi.ProtectionResult.Benign,
    },
  }

  return {
    type: OnchainItemListOptionType.Token,
    currencyInfo,
    quantity: null,
    balanceUSD: null,
  }
}

/**
 * Hook to get Lux/Zoo token options from the local token list.
 * Returns tokens for the specified chain filter.
 */
export function useLuxTokensOptions({
  chainFilter,
  tokensList,
}: {
  chainFilter: Maybe<UniverseChainId>
  tokensList?: TokensList
}): { data: TokenOption[] | undefined; loading: boolean } {
  const tokenOptions = useMemo(() => {
    if (!chainFilter || !isLuxChain(chainFilter) || !tokensList) {
      return undefined
    }

    const filteredTokens = tokensList.tokens.filter(
      (token) => token.chainId === chainFilter,
    )

    if (filteredTokens.length === 0) {
      return undefined
    }

    return filteredTokens.map(tokenListTokenToTokenOption)
  }, [chainFilter, tokensList])

  return {
    data: tokenOptions,
    loading: false,
  }
}
