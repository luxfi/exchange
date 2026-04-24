import { SharedEventName } from '@luxamm/analytics-events'
import { useTranslation } from 'react-i18next'
import { Flex, Text, TouchableArea } from '@l.x/ui/src'
import { iconSizes } from '@l.x/ui/src/theme'
import { formatApprovalAmount } from '@l.x/lx/src/components/activity/utils'
import { CurrencyLogo } from '@l.x/lx/src/components/CurrencyLogo/CurrencyLogo'
import { useLuxContext } from '@l.x/lx/src/contexts/LuxContext'
import { useLocalizationContext } from '@l.x/lx/src/features/language/LocalizationContext'
import { ElementName, ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@l.x/lx/src/features/telemetry/send'
import { useCurrencyInfo } from '@l.x/lx/src/features/tokens/useCurrencyInfo'
import {
  ApproveTransactionInfo,
  Permit2ApproveTransactionInfo,
  TransactionDetails,
  TransactionType,
} from '@l.x/lx/src/features/transactions/types/transactionDetails'
import { getSymbolDisplayText } from '@l.x/lx/src/utils/currency'
import { buildCurrencyId } from '@l.x/lx/src/utils/currencyId'
import { isWebPlatform } from '@l.x/utils/src/platform'

export function ApproveTransactionDetails({
  transactionDetails,
  typeInfo,
  onClose,
}: {
  transactionDetails: TransactionDetails
  typeInfo: ApproveTransactionInfo | Permit2ApproveTransactionInfo
  onClose: () => void
}): JSX.Element | null {
  const { t } = useTranslation()
  const { formatNumberOrString } = useLocalizationContext()
  const { navigateToTokenDetails } = useLuxContext()
  const currencyInfo = useCurrencyInfo(buildCurrencyId(transactionDetails.chainId, typeInfo.tokenAddress ?? ''))

  if (!currencyInfo && typeInfo.type === TransactionType.Permit2Approve) {
    return null
  }

  const approvalAmount = typeInfo.type === TransactionType.Approve ? typeInfo.approvalAmount : typeInfo.amount

  const amount = formatApprovalAmount({
    approvalAmount,
    formatNumberOrString,
    t,
  })

  const symbol = getSymbolDisplayText(currencyInfo?.currency.symbol)

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

  return (
    <TouchableArea onPress={onPressToken}>
      <Flex centered gap="$spacing8" p="$spacing32">
        <Text variant="heading3">{amount}</Text>
        <Flex centered row gap="$spacing8">
          <CurrencyLogo currencyInfo={currencyInfo} size={iconSizes.icon20} />
          <Text color="$neutral2" variant="body2">
            {symbol}
          </Text>
        </Flex>
      </Flex>
    </TouchableArea>
  )
}
