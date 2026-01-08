import { useFormattedCurrencyAmountAndUSDValue } from 'lx/src/components/activity/hooks/useFormattedCurrencyAmountAndUSDValue'
import { useLocalizationContext } from 'lx/src/features/language/LocalizationContext'
import { ValueType } from 'lx/src/features/tokens/getCurrencyAmount'
import { useCurrencyInfo } from 'lx/src/features/tokens/useCurrencyInfo'
import { isUniswapX } from 'lx/src/features/transactions/swap/utils/routing'
import { TransactionDetails } from 'lx/src/features/transactions/types/transactionDetails'
import { isFinalizedTx } from 'lx/src/features/transactions/types/utils'
import { buildCurrencyId, buildNativeCurrencyId } from 'lx/src/utils/currencyId'

export function useNetworkFee(transactionDetails: TransactionDetails): {
  value: string
  amount: string
} {
  const formatter = useLocalizationContext()

  const currencyId = transactionDetails.networkFee
    ? buildCurrencyId(transactionDetails.networkFee.chainId, transactionDetails.networkFee.tokenAddress)
    : buildNativeCurrencyId(transactionDetails.chainId)
  const currencyInfo = useCurrencyInfo(currencyId)

  const currencyAmountRaw =
    transactionDetails.networkFee?.quantity != null
      ? transactionDetails.networkFee.quantity
      : isFinalizedTx(transactionDetails)
        ? '0'
        : undefined

  return useFormattedCurrencyAmountAndUSDValue({
    currency: currencyInfo?.currency,
    currencyAmountRaw,
    valueType: ValueType.Exact,
    formatter,
    isApproximateAmount: false,
    isUniswapX: isUniswapX(transactionDetails),
  })
}
