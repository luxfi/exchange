import { CurrencyTransferContent } from '@l.x/lx/src/components/activity/details/transactions/TransferTransactionDetails'
import { useFormattedCurrencyAmountAndUSDValue } from '@l.x/lx/src/components/activity/hooks/useFormattedCurrencyAmountAndUSDValue'
import { useLocalizationContext } from '@l.x/lx/src/features/language/LocalizationContext'
import { useCurrencyInfo } from '@l.x/lx/src/features/tokens/useCurrencyInfo'
import {
  AuctionBidTransactionInfo,
  AuctionClaimedTransactionInfo,
  AuctionExitedTransactionInfo,
  TransactionDetails,
  TransactionType,
} from '@l.x/lx/src/features/transactions/types/transactionDetails'
import { getSymbolDisplayText } from '@l.x/lx/src/utils/currency'
import { buildCurrencyId } from '@l.x/lx/src/utils/currencyId'

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

  const { amount, value, isLoading } = useFormattedCurrencyAmountAndUSDValue({
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
      isLoading={isLoading}
      tokenAmountWithSymbol={tokenAmountWithSymbol}
      value={value}
      onClose={onClose}
    />
  )
}
