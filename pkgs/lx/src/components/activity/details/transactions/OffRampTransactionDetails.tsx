import { CurrencyTransferContent } from '@l.x/lx/src/components/activity/details/transactions/TransferTransactionDetails'
import { useFormattedCurrencyAmountAndUSDValue } from '@l.x/lx/src/components/activity/hooks/useFormattedCurrencyAmountAndUSDValue'
import { useLocalizationContext } from '@l.x/lx/src/features/language/LocalizationContext'
import { ValueType } from '@l.x/lx/src/features/tokens/getCurrencyAmount'
import { useCurrencyInfo } from '@l.x/lx/src/features/tokens/useCurrencyInfo'
import { OffRampSaleInfo, TransactionDetails } from '@l.x/lx/src/features/transactions/types/transactionDetails'
import { getSymbolDisplayText } from '@l.x/lx/src/utils/currency'
import { buildCurrencyId } from '@l.x/lx/src/utils/currencyId'

export function OffRampTransactionDetails({
  transactionDetails,
  typeInfo,
  onClose,
}: {
  transactionDetails: TransactionDetails
  typeInfo: OffRampSaleInfo
  onClose: () => void
}): JSX.Element {
  const formatter = useLocalizationContext()
  const currencyInfo = useCurrencyInfo(buildCurrencyId(transactionDetails.chainId, typeInfo.destinationTokenAddress))

  const { amount, value, isLoading } = useFormattedCurrencyAmountAndUSDValue({
    currency: currencyInfo?.currency,
    currencyAmountRaw: typeInfo.sourceAmount?.toString(),
    formatter,
    isApproximateAmount: false,
    valueType: ValueType.Exact,
  })
  const symbol = getSymbolDisplayText(currencyInfo?.currency.symbol)

  const tokenAmountWithSymbol = symbol ? amount + ' ' + symbol : amount // Prevents 'undefined' from being displayed

  return (
    <CurrencyTransferContent
      currencyInfo={currencyInfo}
      isLoading={isLoading}
      showValueAsHeading={true}
      tokenAmountWithSymbol={tokenAmountWithSymbol}
      value={value}
      onClose={onClose}
    />
  )
}
