import { MultichainToken } from '@uniswap/client-data-api/dist/data/v1/types_pb'
import { UniverseChainId } from 'uniswap/src/features/chains/types'

/**
 * Keeps only multichain tokens that have a chainToken on the given chain,
 * and narrows each token's chainTokens to only that chain (one entry per token).
 */
export function filterMultichainTokensByChainId(
  tokens: MultichainToken[],
  chainId: UniverseChainId,
): MultichainToken[] {
  const chainIdNum = chainId as number
  return tokens
    .map((token) => {
      const matching = token.chainTokens.find((ct) => ct.chainId === chainIdNum)
      if (!matching) {
        return null
      }
      return new MultichainToken({
        ...token,
        chainTokens: [matching],
      })
    })
    .filter((t): t is MultichainToken => t !== null)
}
