import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { reportBalancesForAnalytics } from 'lx/src/features/accounts/reportBalancesForAnalytics'
import { AccountType } from 'lx/src/features/accounts/types'
import { MobileAppsFlyerEvents } from 'lx/src/features/telemetry/constants'
import { sendAppsFlyerEvent } from 'lx/src/features/telemetry/send'
import { useWallet } from 'lx/src/features/wallet/hooks/useWallet'
import { logger } from 'utilities/src/logger/logger'
import { usePortfolioDataForReporting } from '@luxfi/wallet/src/features/telemetry/hooks/usePortfolioDataForReporting'
import {
  selectLastBalancesReport,
  selectLastBalancesReportValue,
  selectWalletIsFunded,
} from '@luxfi/wallet/src/features/telemetry/selectors'
import { recordBalancesReport, recordWalletFunded } from '@luxfi/wallet/src/features/telemetry/slice'
import {
  type BalanceReportingParams,
  shouldSendBalanceReport,
} from '@luxfi/wallet/src/features/telemetry/utils/balanceReporter'
import { isWalletJustFunded } from '@luxfi/wallet/src/features/telemetry/utils/walletFundingDetector'

/**
 * Reports portfolio balance data to analytics on a controlled schedule
 */
export function useLastBalancesReporter({ isOnboarded }: { isOnboarded: boolean }): void {
  const dispatch = useDispatch()
  const { address, accountType } = useWallet().evmAccount || {}
  const walletIsFunded = useSelector(selectWalletIsFunded)
  const lastBalancesReport = useSelector(selectLastBalancesReport)
  const lastBalancesReportValue = useSelector(selectLastBalancesReportValue)

  const portfolioReportingData = usePortfolioDataForReporting(address)

  // Stable reporting params to prevent excessive effect runs
  const reportingParams: BalanceReportingParams = useMemo(
    () => ({
      lastReport: lastBalancesReport,
      lastValue: lastBalancesReportValue,
      totalBalance: portfolioReportingData.totalBalance,
      totalBalancesUsdPerChain: portfolioReportingData.totalBalancesUsdPerChain,
      wallets: portfolioReportingData.signerAccountAddresses,
      accountBalances: portfolioReportingData.balances,
      wallet: address,
    }),
    [lastBalancesReport, lastBalancesReportValue, portfolioReportingData, address],
  )

  useEffect(() => {
    if (!reportingParams.totalBalance) {
      return
    }

    const shouldRecordWalletFunded = isWalletJustFunded({
      wasAlreadyFunded: walletIsFunded,
      currentTotalBalance: reportingParams.totalBalance,
    })

    if (shouldRecordWalletFunded) {
      dispatch(recordWalletFunded())
      sendAppsFlyerEvent(MobileAppsFlyerEvents.WalletFunded, {
        sumOfFunds: reportingParams.totalBalance,
      }).catch((error) => logger.debug('hooks', 'useLastBalancesReporter', error))
    }
  }, [walletIsFunded, reportingParams.totalBalance, dispatch])

  // Balance reporting with controlled timing
  useEffect(() => {
    if (!isOnboarded || portfolioReportingData.portfolioQuery.isLoading) {
      return
    }

    if (shouldSendBalanceReport(reportingParams)) {
      reportBalancesForAnalytics({
        balances: reportingParams.accountBalances,
        totalBalancesUsd: reportingParams.totalBalance,
        totalBalancesUsdPerChain: reportingParams.totalBalancesUsdPerChain,
        wallet: address,
        wallets: reportingParams.wallets,
        isViewOnly: accountType === AccountType.Readonly,
      })
      dispatch(recordBalancesReport({ totalBalance: reportingParams.totalBalance }))
    }
  }, [isOnboarded, reportingParams, portfolioReportingData.portfolioQuery.isLoading, accountType, address, dispatch])
}
