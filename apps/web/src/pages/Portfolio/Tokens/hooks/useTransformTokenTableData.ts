import { NetworkStatus } from '@apollo/client'
import { GetWalletTokensProfitLossResponse } from '@uniswap/client-data-api/dist/data/v1/api_pb'
import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
import { useMemo } from 'react'
import { DEFAULT_NATIVE_ADDRESS } from 'uniswap/src/features/chains/evm/rpc'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { isStablecoinAddress } from 'uniswap/src/features/chains/utils'
import { useSortedPortfolioBalancesMultichain } from 'uniswap/src/features/dataApi/balances/balances'
import type { PortfolioMultichainBalance } from 'uniswap/src/features/dataApi/types'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
import { currencyAddress } from 'uniswap/src/utils/currencyId'
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
export function useTransformTokenTableData({
  chainIds,
  limit,
  tokenProfitLossData,
}: {
  chainIds?: UniverseChainId[]
  limit?: number
  tokenProfitLossData?: GetWalletTokensProfitLossResponse
}): {
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

      // oxlint-disable-next-line typescript/no-unnecessary-condition
      if (!first) {
        throw new Error('Invariant violation: tokens array is empty after filtering')
      }
      const totalValue = getValueUsdForBalance(balance)
      const price =
        first.valueUsd > 0 && first.quantity > 0 ? first.valueUsd / first.quantity : (balance.priceUsd ?? undefined)
        avgCost: pnl?.avgCost,
        unrealizedPnl: pnl?.unrealizedPnl,
        unrealizedPnlPercent: pnl?.unrealizedPnlPercent,
        isStablecoin,
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
  }, [loading, sortedBalances, error, refetch, networkStatus, limit, chainIds, tokenProfitLossData])
}
