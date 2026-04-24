import { useTranslation } from 'react-i18next'
import { TouchableArea } from '@l.x/ui/src'
import { InlineWarningCard } from '@l.x/lx/src/components/InlineWarningCard/InlineWarningCard'
import { WarningSeverity } from '@l.x/lx/src/components/modals/WarningModal/types'
import { CurrencyInfo } from '@l.x/lx/src/features/dataApi/types'
import { ElementName } from '@l.x/lx/src/features/telemetry/constants'
import Trace from '@l.x/lx/src/features/telemetry/Trace'
import { useBlockaidFeeComparisonAnalytics } from '@l.x/lx/src/features/tokens/warnings/hooks/useBlockaidFeeComparisonAnalytics'
import {
  getSeverityFromTokenProtectionWarning,
  getTokenProtectionFeeOnTransfer,
  getTokenProtectionWarning,
  getTokenWarningSeverity,
  useCardHeaderText,
  useCardSubtitleText,
  useTokenWarningCardText,
} from '@l.x/lx/src/features/tokens/warnings/safetyUtils'
import { TokenProtectionWarning } from '@l.x/lx/src/features/tokens/warnings/types'
import { currencyIdToAddress } from '@l.x/lx/src/utils/currencyId'

type TokenWarningCardProps = {
  currencyInfo: Maybe<CurrencyInfo>
  tokenProtectionWarningOverride?: TokenProtectionWarning
  feeOnTransferOverride?: {
    buyFeePercent?: number
    sellFeePercent?: number
  }
  onPress?: () => void
  headingTestId?: string
  descriptionTestId?: string
  hideCtaIcon?: boolean
  checked?: boolean
  setChecked?: (checked: boolean) => void
}

function useTokenWarningOverrides({
  currencyInfo,
  tokenProtectionWarningOverride,
  feeOnTransferOverride,
}: {
  currencyInfo: Maybe<CurrencyInfo>
  tokenProtectionWarningOverride?: TokenProtectionWarning
  feeOnTransferOverride?: {
    buyFeePercent?: number
    sellFeePercent?: number
  }
}): { severity: WarningSeverity; heading: string | null; description: string | null } {
  const { heading: headingDefault, description: descriptionDefault } = useTokenWarningCardText(currencyInfo)
  const { buyFeePercent, sellFeePercent } = getTokenProtectionFeeOnTransfer(currencyInfo)

  const severity = tokenProtectionWarningOverride
    ? getSeverityFromTokenProtectionWarning(tokenProtectionWarningOverride)
    : getTokenWarningSeverity(currencyInfo)

  const headingOverride = useCardHeaderText({
    tokenProtectionWarning: tokenProtectionWarningOverride ?? TokenProtectionWarning.None,
  })

  const displayedBuyFeePercent = feeOnTransferOverride?.buyFeePercent ?? buyFeePercent
  const displayedSellFeePercent = feeOnTransferOverride?.sellFeePercent ?? sellFeePercent
  const descriptionOverride = useCardSubtitleText({
    tokenProtectionWarning: tokenProtectionWarningOverride ?? TokenProtectionWarning.None,
    tokenSymbol: currencyInfo?.currency.symbol,
    buyFeePercent: displayedBuyFeePercent,
    sellFeePercent: displayedSellFeePercent,
  })

  const heading = tokenProtectionWarningOverride ? headingOverride : headingDefault
  const description = tokenProtectionWarningOverride ? descriptionOverride : descriptionDefault

  return { severity, heading, description }
}

export function TokenWarningCard({
  currencyInfo,
  tokenProtectionWarningOverride,
  feeOnTransferOverride,
  headingTestId,
  descriptionTestId,
  hideCtaIcon,
  checked,
  setChecked,
  onPress,
}: TokenWarningCardProps): JSX.Element | null {
  const { t } = useTranslation()
  const { severity, heading, description } = useTokenWarningOverrides({
    currencyInfo,
    tokenProtectionWarningOverride,
    feeOnTransferOverride,
  })
  useBlockaidFeeComparisonAnalytics(currencyInfo)

  if (!currencyInfo || !severity || !description) {
    return null
  }

  const { buyFeePercent, sellFeePercent } = getTokenProtectionFeeOnTransfer(currencyInfo)
  const analyticsProperties = {
    tokenSymbol: currencyInfo.currency.symbol,
    chainId: currencyInfo.currency.chainId,
    tokenAddress: currencyIdToAddress(currencyInfo.currencyId),
    warningSeverity: WarningSeverity[severity],
    tokenProtectionWarning:
      TokenProtectionWarning[tokenProtectionWarningOverride ?? getTokenProtectionWarning(currencyInfo)],
    buyFeePercent: feeOnTransferOverride?.buyFeePercent ?? buyFeePercent,
    sellFeePercent: feeOnTransferOverride?.sellFeePercent ?? sellFeePercent,
    safetyInfo: currencyInfo.safetyInfo,
  }

  return (
    <Trace logPress={!!onPress} element={ElementName.TokenWarningCard} properties={analyticsProperties}>
      <TouchableArea onPress={onPress}>
        <InlineWarningCard
          hideCtaIcon={hideCtaIcon}
          severity={severity}
          checkboxLabel={setChecked ? t('common.button.understand') : undefined}
          heading={heading ?? undefined}
          description={description}
          headingTestId={headingTestId}
          descriptionTestId={descriptionTestId}
          checked={checked}
          setChecked={setChecked}
          analyticsProperties={analyticsProperties}
          onPressCtaButton={onPress}
        />
      </TouchableArea>
    </Trace>
  )
}
