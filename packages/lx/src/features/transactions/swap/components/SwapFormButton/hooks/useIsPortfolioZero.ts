import { useEnabledChains } from 'lx/src/features/chains/hooks/useEnabledChains'
import { usePortfolioTotalValue } from 'lx/src/features/dataApi/balances/balancesRest'
import { useWallet } from 'lx/src/features/wallet/hooks/useWallet'

export function useIsPortfolioZero(): boolean {
  const wallet = useWallet()
  const { isTestnetModeEnabled } = useEnabledChains()
  const { data } = usePortfolioTotalValue({
    evmAddress: wallet.evmAccount?.address,
    svmAddress: wallet.svmAccount?.address,
  })

  return !isTestnetModeEnabled && data?.balanceUSD === 0
}
