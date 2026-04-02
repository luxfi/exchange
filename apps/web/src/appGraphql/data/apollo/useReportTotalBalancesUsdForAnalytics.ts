import { useCallback, useEffect } from 'react'
import { CONNECTION_PROVIDER_NAMES } from '@l.x/lx/src/constants/web3'
import { useTotalBalancesUsdPerChain } from '@l.x/lx/src/data/balances/utils'
import { CONVERSION_EVENTS } from '@l.x/lx/src/data/rest/conversionTracking/constants'
import { useConversionTracking } from '@l.x/lx/src/data/rest/conversionTracking/useConversionTracking'
import { reportBalancesForAnalytics } from '@l.x/lx/src/features/accounts/reportBalancesForAnalytics'
import { useTokenBalancesQuery } from '~/appGraphql/data/apollo/AdaptiveTokenBalancesProvider'
import { useTotalBalancesUsdForAnalytics } from '~/appGraphql/data/apollo/useTotalBalancesUsdForAnalytics'
import { useAccount } from '~/hooks/useAccount'

export function useReportTotalBalancesUsdForAnalytics() {
  const account = useAccount()
  const totalBalancesUsd = useTotalBalancesUsdForAnalytics()
  const totalBalancesUsdPerChain = useTotalBalancesUsdPerChain(useTokenBalancesQuery({ cacheOnly: true }))
  const { trackConversions } = useConversionTracking(account.address)

  const sendBalancesReport = useCallback(async () => {
    reportBalancesForAnalytics({
      balances: totalBalancesUsd ? [totalBalancesUsd] : [],
      totalBalancesUsd,
      totalBalancesUsdPerChain,
      wallet: account.address,
      wallets: account.address ? [account.address] : [],
    })

    if (account.connector?.name === CONNECTION_PROVIDER_NAMES.LUX_EXTENSION) {
      trackConversions(CONVERSION_EVENTS.Extension.WalletFunded)
    }

    trackConversions(CONVERSION_EVENTS.Web.WalletFunded)
  }, [totalBalancesUsd, totalBalancesUsdPerChain, account.address, account.connector?.name, trackConversions])

  useEffect(() => {
    if (totalBalancesUsd !== undefined && totalBalancesUsdPerChain !== undefined) {
      sendBalancesReport()
    }
  }, [totalBalancesUsd, totalBalancesUsdPerChain, sendBalancesReport])
}
