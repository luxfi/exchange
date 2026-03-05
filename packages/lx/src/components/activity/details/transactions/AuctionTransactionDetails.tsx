import { CurrencyTransferContent } from 'lx/src/components/activity/details/transactions/TransferTransactionDetails'
import { useFormattedCurrencyAmountAndUSDValue } from 'lx/src/components/activity/hooks/useFormattedCurrencyAmountAndUSDValue'
import { useLocalizationContext } from 'lx/src/features/language/LocalizationContext'
import { useCurrencyInfo } from 'lx/src/features/tokens/useCurrencyInfo'
import {
  AuctionBidTransactionInfo,
  AuctionClaimedTransactionInfo,
  AuctionExitedTransactionInfo,
  TransactionDetails,
  TransactionType,
} from 'lx/src/features/transactions/types/transactionDetails'
import { getSymbolDisplayText } from 'lx/src/utils/currency'
import { buildCurrencyId } from 'lx/src/utils/currencyId'

export function AuctionTransactionDetails({
  transactionDetails,
  typeInfo,
  onClose,
}: {
  transactionDetails: TransactionDetails
  typeInfo: AuctionBidTransactionInfo | AuctionClaimedTransactionInfo | AuctionExitedTransactionInfo
  onClose: () => void
}): JSX.Element {
  const formatter = useLocalizationContext()

  const tokenAddress = typeInfo.type === TransactionType.AuctionBid ? typeInfo.bidTokenAddress : typeInfo.tokenAddress

  const currencyInfo = useCurrencyInfo(buildCurrencyId(transactionDetails.chainId, tokenAddress))

  const { amount, value } = useFormattedCurrencyAmountAndUSDValue({
    currency: currencyInfo?.currency,
    currencyAmountRaw: typeInfo.amountRaw,
    formatter,
    isApproximateAmount: false,
  })

  const symbol = getSymbolDisplayText(currencyInfo?.currency.symbol)
  const tokenAmountWithSymbol = symbol ? amount + ' ' + symbol : amount

  return (
    <CurrencyTransferContent
      currencyInfo={currencyInfo}
      tokenAmountWithSymbol={tokenAmountWithSymbol}
      value={value}
      onClose={onClose}
    />
  )
}
