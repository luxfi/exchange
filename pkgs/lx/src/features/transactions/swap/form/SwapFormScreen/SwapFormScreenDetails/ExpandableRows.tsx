import { TradingApi } from '@luxexchange/api'
import { useTranslation } from 'react-i18next'
import { Accordion, Flex, Text } from 'ui/src'
import {
  useTransactionSettingsAutoSlippageToleranceStore,
  useTransactionSettingsStore,
} from 'lx/src/features/transactions/components/settings/stores/transactionSettingsStore/useTransactionSettingsStore'
import { MaxSlippageRow } from 'lx/src/features/transactions/swap/components/MaxSlippageRow/MaxSlippageRow'
import { RoutingInfo } from 'lx/src/features/transactions/swap/components/RoutingInfo/RoutingInfo'
import { SwapRateRatio } from 'lx/src/features/transactions/swap/components/SwapRateRatio'
import { useFeeOnTransferAmounts } from 'lx/src/features/transactions/swap/hooks/useFeeOnTransferAmount'
import { useParsedSwapWarnings } from 'lx/src/features/transactions/swap/hooks/useSwapWarnings/useSwapWarnings'
import { useSwapFormStore } from 'lx/src/features/transactions/swap/stores/swapFormStore/useSwapFormStore'
import { useSwapTxStore } from 'lx/src/features/transactions/swap/stores/swapTxStore/useSwapTxStore'
import { getSwapFeeUsdFromDerivedSwapInfo } from 'lx/src/features/transactions/swap/utils/getSwapFeeUsd'
import { isMultiChainGasQuote, isLxSwap, isWrap } from 'lx/src/features/transactions/swap/utils/routing'
import { TransactionDetails } from 'lx/src/features/transactions/TransactionDetails/TransactionDetails'
import { CurrencyField } from 'lx/src/types/currency'

export function ExpandableRows(): JSX.Element | null {
  const { t } = useTranslation()
  const { gasFee, gasFeeBreakdown } = useSwapTxStore((s) => {
    if (isLxSwap(s)) {
      return {
        gasFee: s.gasFee,
        gasFeeBreakdown: s.gasFeeBreakdown,
      }
    }

    return {
      gasFee: s.gasFee,
      gasFeeBreakdown: undefined,
    }
  })

  const derivedSwapInfo = useSwapFormStore((s) => s.derivedSwapInfo)

  const { priceImpactWarning } = useParsedSwapWarnings()
  const showPriceImpactWarning = Boolean(priceImpactWarning)

  const customSlippageTolerance = useTransactionSettingsStore((s) => s.customSlippageTolerance)
  const autoSlippageTolerance = useTransactionSettingsAutoSlippageToleranceStore((s) => s.autoSlippageTolerance)

  const { chainId, trade } = derivedSwapInfo

  const swapFeeUsd = getSwapFeeUsdFromDerivedSwapInfo(derivedSwapInfo)
  const feeOnTransferProps = useFeeOnTransferAmounts(derivedSwapInfo)

  if (!trade.trade) {
    return null
  }

  return (
    <Accordion.HeightAnimator animation="fast" mt="$spacing8">
      <Accordion.Content animation="fast" p="$none" exitStyle={{ opacity: 0 }}>
        <TransactionDetails
          showExpandedChildren
          routingType={trade.trade.routing}
          chainId={trade.trade.inputAmount.currency.chainId}
          gasFee={gasFee}
          swapFee={trade.trade.swapFee}
          swapFeeUsd={swapFeeUsd}
          indicative={trade.trade.indicative}
          feeOnTransferProps={feeOnTransferProps}
          showGasFeeError={false}
          showSeparatorToggle={false}
          showNetworkLogo={!isMultiChainGasQuote(trade.trade.quote)}
          outputCurrency={trade.trade.outputAmount.currency}
          transactionUSDValue={derivedSwapInfo.currencyAmountsUSDValue[CurrencyField.OUTPUT]}
          dexGasBreakdown={gasFeeBreakdown}
          RateInfo={
            showPriceImpactWarning ? (
              <Flex row alignItems="center" justifyContent="space-between">
                <Text color="$neutral2" variant="body3">
                  {t('swap.details.rate')}
                </Text>
                <Flex row shrink justifyContent="flex-end">
                  <SwapRateRatio trade={trade.trade} derivedSwapInfo={derivedSwapInfo} />
                </Flex>
              </Flex>
            ) : undefined
          }
        >
          {trade.trade.routing !== TradingApi.Routing.BRIDGE && (
            <MaxSlippageRow
              acceptedDerivedSwapInfo={derivedSwapInfo}
              autoSlippageTolerance={autoSlippageTolerance}
              customSlippageTolerance={customSlippageTolerance}
            />
          )}
          {trade.trade.routing !== TradingApi.Routing.BRIDGE && !isWrap(trade.trade) && (
            <RoutingInfo trade={trade.trade} gasFee={gasFee} chainId={chainId} />
          )}
        </TransactionDetails>
      </Accordion.Content>
    </Accordion.HeightAnimator>
  )
}
