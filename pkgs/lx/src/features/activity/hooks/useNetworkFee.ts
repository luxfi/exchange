import { useFormattedCurrencyAmountAndUSDValue } from '@l.x/lx/src/components/activity/hooks/useFormattedCurrencyAmountAndUSDValue'
import { useLocalizationContext } from '@l.x/lx/src/features/language/LocalizationContext'
import { useCurrencyInfo } from '@l.x/lx/src/features/tokens/useCurrencyInfo'
import { isLxSwap } from '@l.x/lx/src/features/transactions/swap/utils/routing'
import { TransactionDetails } from '@l.x/lx/src/features/transactions/types/transactionDetails'
import { isFinalizedTx } from '@l.x/lx/src/features/transactions/types/utils'
import { buildCurrencyId, buildNativeCurrencyId } from '@l.x/lx/src/utils/currencyId'

export function useNetworkFee(transactionDetails: TransactionDetails): {
  value: string
  amount: string
  isLoading: boolean
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
    valueType: transactionDetails.networkFee?.valueType,
    formatter,
    isApproximateAmount: false,
    isLxSwap: isLxSwap(transactionDetails),
  })
}
