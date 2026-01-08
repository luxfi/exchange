import { SharedEventName } from '@luxdex/analytics-events'
import { Flex, Loader, Text, TouchableArea } from 'ui/src'
import { fonts, iconSizes } from 'ui/src/theme'
import { NftTransactionDetails } from 'lx/src/components/activity/details/transactions/NftTransactionDetails'
import { useFormattedCurrencyAmountAndUSDValue } from 'lx/src/components/activity/hooks/useFormattedCurrencyAmountAndUSDValue'
import { CurrencyLogo } from 'lx/src/components/CurrencyLogo/CurrencyLogo'
import { useUniswapContext } from 'lx/src/contexts/UniswapContext'
import { AssetType } from 'lx/src/entities/assets'
import { CurrencyInfo } from 'lx/src/features/dataApi/types'
import { useLocalizationContext } from 'lx/src/features/language/LocalizationContext'
import { ElementName, ModalName } from 'lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'lx/src/features/telemetry/send'
import { useCurrencyInfo } from 'lx/src/features/tokens/useCurrencyInfo'
import {
  ReceiveTokenTransactionInfo,
  SendTokenTransactionInfo,
  TransactionDetails,
} from 'lx/src/features/transactions/types/transactionDetails'
import { getSymbolDisplayText } from 'lx/src/utils/currency'
import { buildCurrencyId } from 'lx/src/utils/currencyId'
import { isWebPlatform } from 'utilities/src/platform'

export function TransferTransactionDetails({
  transactionDetails,
  typeInfo,
  onClose,
}: {
  transactionDetails: TransactionDetails
  typeInfo: ReceiveTokenTransactionInfo | SendTokenTransactionInfo
  onClose: () => void
}): JSX.Element {
  const formatter = useLocalizationContext()
  const isCurrency = typeInfo.assetType === AssetType.Currency
  const currencyInfo = useCurrencyInfo(
    isCurrency ? buildCurrencyId(transactionDetails.chainId, typeInfo.tokenAddress) : undefined,
  )

  const { amount, value } = useFormattedCurrencyAmountAndUSDValue({
    currency: currencyInfo?.currency,
    currencyAmountRaw: typeInfo.currencyAmountRaw,
    formatter,
    isApproximateAmount: false,
  })
  const symbol = getSymbolDisplayText(currencyInfo?.currency.symbol)

  const tokenAmountWithSymbol = symbol ? amount + ' ' + symbol : amount // Prevents 'undefined' from being displayed

  return isCurrency ? (
    <CurrencyTransferContent
      currencyInfo={currencyInfo}
      tokenAmountWithSymbol={tokenAmountWithSymbol}
      value={value}
      onClose={onClose}
    />
  ) : (
    <NftTransactionDetails transactionDetails={transactionDetails} typeInfo={typeInfo} onClose={onClose} />
  )
}

export function CurrencyTransferContent({
  tokenAmountWithSymbol,
  currencyInfo,
  value,
  onClose,
  showValueAsHeading = false,
}: {
  tokenAmountWithSymbol: string | undefined
  currencyInfo: Maybe<CurrencyInfo>
  value: string
  onClose: () => void
  showValueAsHeading?: boolean
}): JSX.Element {
  const { navigateToTokenDetails } = useUniswapContext()

  const onPressToken = (): void => {
    if (currencyInfo) {
      sendAnalyticsEvent(SharedEventName.ELEMENT_CLICKED, {
        element: ElementName.TokenItem,
        modal: ModalName.TransactionDetails,
      })

      navigateToTokenDetails(currencyInfo.currencyId)
      if (!isWebPlatform) {
        onClose()
      }
    }
  }

  const headingText = showValueAsHeading ? value : tokenAmountWithSymbol
  const subtitleText = showValueAsHeading ? tokenAmountWithSymbol : value

  const headingIsLoading = headingText === '-'
  const subtitleIsLoading = subtitleText === '-'

  return (
    <TouchableArea onPress={onPressToken}>
      <Flex centered gap="$spacing8" p="$spacing32">
        {headingIsLoading ? (
          <Loader.Box height={fonts.heading2.lineHeight} width={iconSizes.icon100} />
        ) : (
          <Text variant="heading2" textAlign="center">
            {headingText}
          </Text>
        )}
        <Flex centered row gap="$spacing8">
          <CurrencyLogo currencyInfo={currencyInfo} size={iconSizes.icon20} />
          {subtitleIsLoading ? (
            <Loader.Box height={fonts.body2.lineHeight} width={iconSizes.icon48} />
          ) : (
            <Text color="$neutral2" variant="body2">
              {subtitleText}
            </Text>
          )}
        </Flex>
      </Flex>
    </TouchableArea>
  )
}
