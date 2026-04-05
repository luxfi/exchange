import { NetworkStatus } from '@apollo/client'
import { isWarmLoadingStatus } from '@universe/api'
import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import isEqual from 'lodash/isEqual'
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import { PollingInterval } from 'uniswap/src/constants/misc'
import { useSortedPortfolioBalancesMultichain } from 'uniswap/src/features/dataApi/balances/balances'
import { PortfolioMultichainBalance } from 'uniswap/src/features/dataApi/types'
import { HIDDEN_TOKEN_BALANCES_ROW, TokenBalanceListRow } from 'uniswap/src/features/portfolio/types'
import { CurrencyId } from 'uniswap/src/types/currency'

type TokenBalanceListContextState = {
  balancesById: Record<string, PortfolioMultichainBalance> | undefined
  networkStatus: NetworkStatus
  refetch: (() => void) | undefined
  hiddenTokensCount: number
  hiddenTokensExpanded: boolean
  isPortfolioBalancesLoading: boolean
  isWarmLoading: boolean
  rows: Array<TokenBalanceListRow>
  setHiddenTokensExpanded: Dispatch<SetStateAction<boolean>>
  onPressToken?: (currencyId: CurrencyId) => void
  evmOwner?: Address
  svmOwner?: Address
}

export const TokenBalanceListContext = createContext<TokenBalanceListContextState | undefined>(undefined)

export function TokenBalanceListContextProvider({
  evmOwner,
  svmOwner,
  isExternalProfile,
  children,
  onPressToken,
}: PropsWithChildren<{
  evmOwner?: Address
  svmOwner?: Address
  isExternalProfile: boolean
  onPressToken?: (currencyId: CurrencyId) => void
}>): JSX.Element {
  const isMultichainTokenUx = useFeatureFlag(FeatureFlags.MultichainTokenUx)

  const {
    data: sortedData,
    balancesById,
    networkStatus,
    refetch,
    loading: isPortfolioBalancesLoading,
  } = useSortedPortfolioBalancesMultichain({
    evmAddress: evmOwner,
    svmAddress: svmOwner,
    pollInterval: PollingInterval.KindaFast,
    requestMultichainFromBackend: isMultichainTokenUx,
  })

  const hiddenTokensCount = sortedData?.hiddenBalances.length ?? 0

  const shouldShowHiddenTokens = !sortedData?.balances.length && !!sortedData?.hiddenBalances.length

  const [hiddenTokensExpanded, setHiddenTokensExpanded] = useState(shouldShowHiddenTokens)

  const rowsRef = useRef<TokenBalanceListRow[]>(undefined)

  const rows = useMemo<TokenBalanceListRow[]>(() => {
    if (!sortedData) {
      return []
    }
    const shownIds = sortedData.balances.map((b) => b.id)
    const hiddenIds = sortedData.hiddenBalances.map((b) => b.id)
    const newRowIds: TokenBalanceListRow[] = [
      ...shownIds,
      ...(hiddenIds.length ? [HIDDEN_TOKEN_BALANCES_ROW] : []),
      ...(hiddenTokensExpanded ? hiddenIds : []),
    ]
    if (!rowsRef.current || !isEqual(rowsRef.current, newRowIds)) {
      rowsRef.current = newRowIds
    }
    return rowsRef.current
  }, [sortedData, hiddenTokensExpanded])

  const hasData = !!balancesById
  const isWarmLoading = hasData && isWarmLoadingStatus(networkStatus) && !isExternalProfile

  const state = useMemo<TokenBalanceListContextState>(
    (): TokenBalanceListContextState => ({
      balancesById,
      hiddenTokensCount,
      hiddenTokensExpanded,
      isPortfolioBalancesLoading,
      isWarmLoading,
      networkStatus,
      onPressToken,
      refetch,
      rows,
      setHiddenTokensExpanded,
      evmOwner,
      svmOwner,
    }),
    [
      balancesById,
      hiddenTokensCount,
      hiddenTokensExpanded,
      isPortfolioBalancesLoading,
      isWarmLoading,
      networkStatus,
      onPressToken,
      refetch,
      rows,
      evmOwner,
      svmOwner,
    ],
  )

  return <TokenBalanceListContext.Provider value={state}>{children}</TokenBalanceListContext.Provider>
}

export const useTokenBalanceListContext = (): TokenBalanceListContextState => {
  const context = useContext(TokenBalanceListContext)

  if (context === undefined) {
    throw new Error('`useTokenBalanceListContext` must be used inside of `TokenBalanceListContextProvider`')
  }

  return context
}
