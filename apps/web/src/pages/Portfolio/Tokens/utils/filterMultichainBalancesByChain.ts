import { UniverseChainId } from 'uniswap/src/features/chains/types'
import type { PortfolioChainBalance, PortfolioMultichainBalance } from 'uniswap/src/features/dataApi/types'

/**
 * Creates helpers to filter multichain portfolio balances by chain ID.
 * Used when the multichain_token_ux flag is on and the user filters by network —
 * the backend may not filter multichainBalances by chainIds, so we filter on the client.
 *
 * When chainIds is undefined or empty, helpers behave as no-ops (all balances/tokens pass through).
 */
export function createChainFilter(chainIds: UniverseChainId[] | undefined): {
  /** Balances that have at least one token (and, when chainIds set, on a selected chain). */
  filterBalances: (balances: PortfolioMultichainBalance[]) => PortfolioMultichainBalance[]
  /** USD value for a balance: when chainIds set, sum of tokens on those chains; else balance total. */
  getValueUsdForBalance: (balance: PortfolioMultichainBalance) => number
  /** Tokens to show for a row: when chainIds set, only tokens on those chains; else all. */
  getTokensForRow: (balance: PortfolioMultichainBalance) => PortfolioChainBalance[]
} {
  const chainIdSet = chainIds?.length ? new Set(chainIds) : undefined

  const sumTokenValueUsd = (tokens: PortfolioChainBalance[]): number =>
    tokens.reduce((sum, t) => sum + (t.valueUsd ?? 0), 0)

  const getFallbackValueUsd = (b: PortfolioMultichainBalance): number => b.totalValueUsd ?? b.tokens[0]?.valueUsd ?? 0

  const filterBalances = (balances: PortfolioMultichainBalance[]): PortfolioMultichainBalance[] =>
    balances.filter((b) => b.tokens.length > 0 && (!chainIdSet || b.tokens.some((t) => chainIdSet.has(t.chainId))))

  const getValueUsdForBalance = (balance: PortfolioMultichainBalance): number => {
    if (chainIdSet) {
      return sumTokenValueUsd(balance.tokens.filter((t) => chainIdSet.has(t.chainId)))
    }
    return getFallbackValueUsd(balance)
  }

  const getTokensForRow = (balance: PortfolioMultichainBalance): PortfolioChainBalance[] =>
    chainIdSet ? balance.tokens.filter((t) => chainIdSet.has(t.chainId)) : balance.tokens

  return {
    filterBalances,
    getValueUsdForBalance,
    getTokensForRow,
  }
}
