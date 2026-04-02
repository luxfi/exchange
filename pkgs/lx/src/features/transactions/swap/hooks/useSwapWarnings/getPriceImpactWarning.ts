import { Percent } from '@luxamm/sdk-core'
import { TFunction } from 'i18next'
import { AlertTriangleFilled } from 'ui/src/components/icons'
import { Warning, WarningAction, WarningLabel, WarningSeverity } from 'lx/src/components/modals/WarningModal/types'
import { PRICE_IMPACT_CRITICAL_THRESHOLD, PRICE_IMPACT_WARNING_THRESHOLD } from 'lx/src/constants/transactions'
import { lxUrls } from 'lx/src/constants/urls'
import { LocalizationContextState } from 'lx/src/features/language/LocalizationContext'
import { formatPriceImpact } from 'lx/src/features/transactions/swap/utils/formatPriceImpact'

const PRICE_IMPACT_THRESHOLD_MEDIUM = new Percent(PRICE_IMPACT_WARNING_THRESHOLD, 100)
const PRICE_IMPACT_THRESHOLD_HIGH = new Percent(PRICE_IMPACT_CRITICAL_THRESHOLD, 100)

export function getPriceImpactWarning({
  t,
  priceImpact,
  formatPercent,
}: {
  t: TFunction
  priceImpact?: Percent
  formatPercent: LocalizationContextState['formatPercent']
}): Warning | undefined {
  // only show an error if price impact is defined and greater than the threshold
  if (!priceImpact?.greaterThan(PRICE_IMPACT_THRESHOLD_MEDIUM)) {
    return undefined
  }

  const priceImpactValue = formatPriceImpact(priceImpact, formatPercent) ?? ''
  const highImpact = !priceImpact.lessThan(PRICE_IMPACT_THRESHOLD_HIGH)

  return {
    type: highImpact ? WarningLabel.PriceImpactHigh : WarningLabel.PriceImpactMedium,
    severity: highImpact ? WarningSeverity.High : WarningSeverity.Medium,
    action: WarningAction.WarnBeforeSubmit,
    icon: AlertTriangleFilled,
    title: t('swap.warning.priceImpact.title', {
      priceImpactValue,
    }),
    message: t('swap.warning.priceImpact.message', {
      priceImpactValue,
    }),
    link: lxUrls.helpArticleUrls.priceImpact,
  }
}
