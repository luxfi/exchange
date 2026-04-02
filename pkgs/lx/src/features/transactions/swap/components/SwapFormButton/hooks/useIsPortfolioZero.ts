import { useActiveAddresses } from 'lx/src/features/accounts/store/hooks'
import { useEnabledChains } from 'lx/src/features/chains/hooks/useEnabledChains'
import { usePortfolioTotalValue } from 'lx/src/features/dataApi/balances/balancesRest'

export function useIsPortfolioZero(): boolean {
  const { isTestnetModeEnabled } = useEnabledChains()
  const { data } = usePortfolioTotalValue(useActiveAddresses())

  return !isTestnetModeEnabled && data?.balanceUSD === 0
}
