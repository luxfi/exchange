import { NetworkStatus } from '@apollo/client'
<<<<<<< HEAD
import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
import { useMemo } from 'react'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { useSortedPortfolioBalancesMultichain } from 'lx/src/features/dataApi/balances/balances'
import type { PortfolioMultichainBalance } from 'lx/src/features/dataApi/types'
import { CurrencyInfo } from 'lx/src/features/dataApi/types'
import { TestID } from 'lx/src/test/fixtures/testIDs'
=======
import { GetWalletTokensProfitLossResponse } from '@uniswap/client-data-api/dist/data/v1/api_pb'
import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { useMemo } from 'react'
import { DEFAULT_NATIVE_ADDRESS } from 'uniswap/src/features/chains/evm/rpc'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { isStablecoinAddress } from 'uniswap/src/features/chains/utils'
import { useSortedPortfolioBalancesMultichain } from 'uniswap/src/features/dataApi/balances/balances'
import type { PortfolioMultichainBalance } from 'uniswap/src/features/dataApi/types'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
import { currencyAddress } from 'uniswap/src/utils/currencyId'
>>>>>>> upstream/main
import { usePortfolioAddresses } from '~/pages/Portfolio/hooks/usePortfolioAddresses'
import { createChainFilter } from '~/pages/Portfolio/Tokens/utils/filterMultichainBalancesByChain'

/** Per-chain token instance (use TokenData['tokens'][number] in other modules) */
interface TokenDataToken {
  chainId: number
  currencyInfo: CurrencyInfo
  quantity: number
  valueUsd: number
  symbol: string | undefined
}

export interface TokenData {
  id: string
  testId: string
  chainId: number
  currencyInfo: CurrencyInfo
  quantity: number
  symbol: string | undefined
  price: number | undefined
  change1d: number | undefined
  tokens: TokenDataToken[]
  totalValue: number
  allocation: number
  isHidden: boolean | null | undefined
<<<<<<< HEAD
=======
  avgCost?: number
  unrealizedPnl?: number
  unrealizedPnlPercent?: number
  isStablecoin: boolean
>>>>>>> upstream/main
}

// Custom hook to format portfolio data
// When flag OFF: do not request multichain from backend → backend returns legacy → we transform to multichain shape for the table.
// When flag ON: request multichain from backend → backend returns portfolio.multichainBalances → no transform needed.
<<<<<<< HEAD
export function useTransformTokenTableData({ chainIds, limit }: { chainIds?: UniverseChainId[]; limit?: number }): {
=======
export function useTransformTokenTableData({
  chainIds,
  limit,
  tokenProfitLossData,
}: {
  chainIds?: UniverseChainId[]
  limit?: number
  tokenProfitLossData?: GetWalletTokensProfitLossResponse
}): {
>>>>>>> upstream/main
  visible: TokenData[] | null
  hidden: TokenData[] | null
  totalCount: number | null
  loading: boolean
  refetching: boolean
  error: Error | undefined
  refetch: (() => void) | undefined
  networkStatus: NetworkStatus
} {
  const { evmAddress, svmAddress } = usePortfolioAddresses()
  const isMultichainTokenUx = useFeatureFlag(FeatureFlags.MultichainTokenUx)

  const {
    data: sortedBalances,
    loading,
    error,
    refetch,
    networkStatus,
  } = useSortedPortfolioBalancesMultichain({
    evmAddress,
    svmAddress,
    chainIds,
    // Flag OFF: legacy data from backend, transform to multichain shape on client. Flag ON: multichain (mock) data from backend.
    requestMultichainFromBackend: isMultichainTokenUx,
  })

  return useMemo(() => {
    // Only show empty state on initial load, not during refetch.
    // networkStatus === NetworkStatus.loading means the query has never completed.
    // This is synchronously true from the very first render when there is no cached data, even before isFetching is set.
    const isInitialLoading = networkStatus === NetworkStatus.loading && !sortedBalances
    const isRefetching = loading && !!sortedBalances

    if (isInitialLoading) {
      return {
        visible: null,
        hidden: null,
        totalCount: null,
        loading: true,
        refetching: false,
        error,
        refetch,
        networkStatus,
      }
    }

    if (!sortedBalances) {
      return { visible: [], hidden: [], totalCount: 0, loading, refetching: false, error, refetch, networkStatus }
    }

    const chainFilter = createChainFilter(chainIds)
    const { filterBalances, getValueUsdForBalance, getTokensForRow } = chainFilter
    const visibleBalances = filterBalances(sortedBalances.balances)
    const hiddenBalancesFiltered = filterBalances(sortedBalances.hiddenBalances)

    const totalUSDVisible = visibleBalances.reduce((sum, b) => sum + getValueUsdForBalance(b), 0)

<<<<<<< HEAD
=======
    const pnlLookup = new Map<string, { avgCost: number; unrealizedPnl: number; unrealizedPnlPercent: number }>()
    if (tokenProfitLossData?.tokenProfitLosses) {
      for (const entry of tokenProfitLossData.tokenProfitLosses) {
        if (entry.token) {
          const key = `${entry.token.address.toLowerCase()}-${entry.token.chainId}`
          pnlLookup.set(key, {
            avgCost: entry.averageCostUsd,
            unrealizedPnl: entry.unrealizedReturnUsd,
            unrealizedPnlPercent: entry.unrealizedReturnPercent,
          })
        }
      }
    }

>>>>>>> upstream/main
    const mapBalanceToTokenData = (
      balance: PortfolioMultichainBalance,
      allocationFromTotal?: number,
    ): TokenData | null => {
      const tokensForRow = getTokensForRow(balance)
      const tokens: TokenData['tokens'] = tokensForRow
        .map((t) => ({
          chainId: t.chainId,
          currencyInfo: t.currencyInfo,
          quantity: t.quantity,
          valueUsd: t.valueUsd ?? 0,
          symbol: t.currencyInfo.currency.symbol,
        }))
        .sort((a, b) => b.valueUsd - a.valueUsd)
      const first = tokens[0]
      // useTransformTokenTableData already ensures that there is at least one token, but adding check for safety
<<<<<<< HEAD
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
=======
      // oxlint-disable-next-line typescript/no-unnecessary-condition
>>>>>>> upstream/main
      if (!first) {
        throw new Error('Invariant violation: tokens array is empty after filtering')
      }
      const totalValue = getValueUsdForBalance(balance)
      const price =
        first.valueUsd > 0 && first.quantity > 0 ? first.valueUsd / first.quantity : (balance.priceUsd ?? undefined)
<<<<<<< HEAD
=======

      // currencyAddress() returns the legacy native address (0xeeee...) for native tokens,
      // but the backend returns the canonical zero address (0x0000...). Normalize for lookup.
      const rawAddr = currencyAddress(first.currencyInfo.currency).toLowerCase()
      const addr = first.currencyInfo.currency.isNative ? DEFAULT_NATIVE_ADDRESS : rawAddr
      const pnl = pnlLookup.get(`${addr}-${first.chainId}`)
      const isStablecoin = isStablecoinAddress(first.chainId as UniverseChainId, addr)

>>>>>>> upstream/main
      return {
        id: balance.id,
        testId: `${TestID.TokenTableRowPrefix}${balance.id}`,
        chainId: first.chainId,
        currencyInfo: first.currencyInfo,
        quantity: first.quantity,
        symbol: first.symbol,
        price,
        tokens,
        totalValue,
        allocation: allocationFromTotal ?? 0,
        change1d: balance.pricePercentChange1d ?? undefined,
        isHidden: balance.isHidden,
<<<<<<< HEAD
=======
        avgCost: pnl?.avgCost,
        unrealizedPnl: pnl?.unrealizedPnl,
        unrealizedPnlPercent: pnl?.unrealizedPnlPercent,
        isStablecoin,
>>>>>>> upstream/main
      }
    }

    const visible = visibleBalances
      .map((b) => {
        const valueUSD = getValueUsdForBalance(b)
        const allocation = totalUSDVisible > 0 ? (valueUSD / totalUSDVisible) * 100 : 0
        return mapBalanceToTokenData(b, allocation)
      })
      .filter((d): d is TokenData => d !== null)

    const hidden = hiddenBalancesFiltered
      .map((b) => mapBalanceToTokenData(b, 0))
      .filter((d): d is TokenData => d !== null)

    // Apply limit to visible tokens if specified
    const limitedVisible = limit ? visible.slice(0, limit) : visible
    const totalCount = visible.length

    return {
      visible: limitedVisible,
      hidden,
      totalCount,
      loading,
      refetching: isRefetching,
      refetch,
      networkStatus,
      error,
    }
<<<<<<< HEAD
  }, [loading, sortedBalances, error, refetch, networkStatus, limit, chainIds])
=======
  }, [loading, sortedBalances, error, refetch, networkStatus, limit, chainIds, tokenProfitLossData])
>>>>>>> upstream/main
}
