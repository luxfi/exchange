import type { ListTokensResponse } from '@uniswap/client-data-api/dist/data/v1/api_pb'
import {
  ChainToken,
  ChainTokenStats,
  MultichainToken,
  SafetyLevel,
  SpamCode,
  type Token,
} from '@uniswap/client-data-api/dist/data/v1/types_pb'

/**
 * Transforms a ListTokens response that uses the legacy `tokens` shape
 * into the multichain `multichainTokens` shape.
 *
 * For the backend-sorted legacy API, each token is a single token on a single
 * chain, so each token becomes one MultichainToken with exactly one ChainToken
 * in chainTokens. Use when the backend returns tokens (multichain: false)
 * but the consumer expects MultichainToken[].
 *
 * @param response - ListTokensResponse with tokens array; undefined or empty tokens returns [].
 * @returns MultichainToken[] in the canonical multichain shape.
 */
export function backendSortedToMultichainTokens(response: ListTokensResponse | undefined): MultichainToken[] {
  if (!response?.tokens.length) {
    return []
  }
  return response.tokens.map((token) => tokenToMultichainToken(token))
}

function tokenToMultichainToken(token: Token): MultichainToken {
  const metadata = token.metadata
  const multichainId = `mc:${token.chainId}_${token.address}`

  const chainTokenStats = token.stats
    ? new ChainTokenStats({
        volume1h: token.stats.volume1h,
        volume1d: token.stats.volume1d,
        volume7d: token.stats.volume7d,
        volume30d: token.stats.volume30d,
        volume1y: token.stats.volume1y,
      })
    : undefined

  const chainToken = new ChainToken({
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    isBridged: metadata?.isBridged ?? false,
    stats: chainTokenStats,
  })

  return new MultichainToken({
    multichainId,
    symbol: token.symbol,
    name: token.name,
    type: token.type,
    projectName: metadata?.projectName ?? '',
    logoUrl: metadata?.logoUrl ?? '',
    protectionInfo: metadata?.protectionInfo,
    feeData: metadata?.feeData,
    safetyLevel: metadata?.safetyLevel ?? SafetyLevel.UNKNOWN,
    spamCode: metadata?.spamCode ?? SpamCode.UNKNOWN,
    stats: token.stats,
    chainTokens: [chainToken],
  })
}
