import type { MultichainToken } from '@uniswap/client-data-api/dist/data/v1/types_pb'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { TokenSortMethod } from '~/components/Tokens/constants'
import type { UseListTokensOptions } from '~/state/explore/listTokens/types'
import { buildTokenSortRankFromMultichain } from '~/state/explore/listTokens/utils/buildTokenSortRankFromMultichain'
import { filterMultichainTokensByChainId } from '~/state/explore/listTokens/utils/filterMultichainTokensByChainId'
import { filterMultichainTokensBySearchString } from '~/state/explore/listTokens/utils/filterMultichainTokensBySearchString'

function sortMultichainTokensByPrice(tokens: MultichainToken[], sortAscending: boolean): MultichainToken[] {
  const sorted = [...tokens].sort((a, b) => {
    const priceA = a.stats?.price ?? 0
    const priceB = b.stats?.price ?? 0
    return priceB - priceA
  })
  return sortAscending ? sorted.reverse() : sorted
}

/** Client-side sort only (PRICE); otherwise API / legacy order is kept. */
function sortTokensForDisplay(tokens: MultichainToken[], options: Required<UseListTokensOptions>): MultichainToken[] {
  if (options.sortMethod === TokenSortMethod.PRICE) {
    return sortMultichainTokensByPrice(tokens, options.sortAscending)
  }
  return tokens
}

type ProcessMultichainTokensForDisplayResult = {
  topTokens: MultichainToken[]
  /** multichainId → 1-based rank after client sort, before search filter. */
  tokenSortRank: Record<string, number>
}

type ProcessMultichainTokensForDisplayOptions = Required<UseListTokensOptions> & {
  /** When set, only tokens with a chainToken on this chain are returned, each narrowed to that chain. */
  chainId?: UniverseChainId
}

/**
 * 1) Sort — client PRICE sort when `sortMethod === PRICE`, else incoming order.
 * 2) Rank — `tokenSortRank` from that sorted list.
 * 3) Filter — search on the sorted list, then optional chain filter when options.chainId is provided.
 *
 * - Legacy path: hook does non-PRICE sort only; PRICE sort + filter are done here, then caller slices.
 * - Backend path: BE sorts except for PRICE; we apply client-side price sort here when sortMethod is PRICE.
 */
export function processMultichainTokensForDisplay(
  tokens: MultichainToken[],
  options: ProcessMultichainTokensForDisplayOptions,
): ProcessMultichainTokensForDisplayResult {
  const sorted = sortTokensForDisplay(tokens, options)
  const tokenSortRank = buildTokenSortRankFromMultichain(sorted)
  let topTokens = filterMultichainTokensBySearchString(sorted, options.filterString)
  if (options.chainId !== undefined) {
    topTokens = filterMultichainTokensByChainId(topTokens, options.chainId)
  }
  return { topTokens, tokenSortRank }
}
