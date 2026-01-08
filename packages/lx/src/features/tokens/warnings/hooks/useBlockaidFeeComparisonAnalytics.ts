import { FeatureFlags, useFeatureFlag } from '@luxfi/gating'
import { useEffect, useRef } from 'react'
import { getNativeAddress } from 'lx/src/constants/addresses'
import { CurrencyInfo } from 'lx/src/features/dataApi/types'
import { UniswapEventName } from 'lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'lx/src/features/telemetry/send'
import { getTokenProtectionFeeOnTransfer } from 'lx/src/features/tokens/warnings/safetyUtils'

/**
 * Logs an analytics event when there are discrepancies between our backend's and Blockaid's fee-on-transfer (FOT) detection.
 * This data helps the protocols team identify and improve FOT detection accuracy.
 *
 * @param currencyInfo - The result of useCurrencyInfo()
 */
export function useBlockaidFeeComparisonAnalytics(currencyInfo: Maybe<CurrencyInfo>): void {
  const isBlockaidFotLoggingEnabled = useFeatureFlag(FeatureFlags.BlockaidFotLogging)
  const sentEventCurrencyIdRef = useRef<string>(undefined)
  const { buyFeePercent, sellFeePercent } = getTokenProtectionFeeOnTransfer(currencyInfo)
  const blockaidBuyFeePercent = currencyInfo?.safetyInfo?.blockaidFees?.buyFeePercent ?? 0
  const blockaidSellFeePercent = currencyInfo?.safetyInfo?.blockaidFees?.sellFeePercent ?? 0

  useEffect(() => {
    if (!currencyInfo || !isBlockaidFotLoggingEnabled) {
      return
    }

    const normalizedBuyFee = buyFeePercent ?? 0
    const normalizedSellFee = sellFeePercent ?? 0

    // Only send if fees are different and we haven't sent for this token before
    if (
      sentEventCurrencyIdRef.current !== currencyInfo.currencyId &&
      currencyInfo.currency.symbol &&
      currencyInfo.currency.chainId &&
      (normalizedBuyFee !== blockaidBuyFeePercent || normalizedSellFee !== blockaidSellFeePercent)
    ) {
      const address = currencyInfo.currency.isToken
        ? currencyInfo.currency.address
        : getNativeAddress(currencyInfo.currency.chainId)

      sendAnalyticsEvent(UniswapEventName.BlockaidFeesMismatch, {
        symbol: currencyInfo.currency.symbol,
        address,
        chainId: currencyInfo.currency.chainId,
        buyFeePercent,
        sellFeePercent,
        blockaidBuyFeePercent: currencyInfo.safetyInfo?.blockaidFees?.buyFeePercent,
        blockaidSellFeePercent: currencyInfo.safetyInfo?.blockaidFees?.sellFeePercent,
        attackType: currencyInfo.safetyInfo?.attackType,
        protectionResult: currencyInfo.safetyInfo?.protectionResult,
      })
      sentEventCurrencyIdRef.current = currencyInfo.currencyId
    }
  }, [
    buyFeePercent,
    sellFeePercent,
    blockaidBuyFeePercent,
    blockaidSellFeePercent,
    currencyInfo,
    isBlockaidFotLoggingEnabled,
  ])
}
