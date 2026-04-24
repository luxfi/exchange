import { useTranslation } from 'react-i18next'
import { useSporeColors } from '@l.x/ui/src'
import { Settings } from '@l.x/ui/src/components/icons/Settings'
import { zIndexes } from '@l.x/ui/src/theme'
import { WarningSeverity } from '@l.x/lx/src/components/modals/WarningModal/types'
import { WarningInfo } from '@l.x/lx/src/components/modals/WarningModal/WarningInfo'
import { LearnMoreLink } from '@l.x/lx/src/components/text/LearnMoreLink'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { SlippageInfoCaption } from '@l.x/lx/src/features/transactions/swap/components/MaxSlippageRow/SlippageInfo/SlippageInfoCaption'
import type { SlippageInfoProps } from '@l.x/lx/src/features/transactions/swap/components/MaxSlippageRow/SlippageInfo/types'
import { isMobileApp } from '@l.x/utils/src/platform'

export function SlippageInfo({
  children,
  trade,
  isCustomSlippage,
  autoSlippageTolerance,
}: SlippageInfoProps): JSX.Element {
  const { t } = useTranslation()
  const colors = useSporeColors()

  // Avoid showing min out / max in UI when on an indicative quote.
  if (trade.indicative) {
    return <>{children}</>
  }

  const captionContent = (
    <SlippageInfoCaption
      trade={trade}
      isCustomSlippage={isCustomSlippage}
      autoSlippageTolerance={autoSlippageTolerance}
    />
  )

  return (
    <WarningInfo
      infoButton={
        isMobileApp ? <LearnMoreLink textColor="$neutral1" url={lxUrls.helpArticleUrls.swapSlippage} /> : null
      }
      modalProps={{
        backgroundIconColor: colors.surface2.get(),
        captionComponent: captionContent,
        rejectText: t('common.button.close'),
        icon: <Settings color="$neutral2" size="$icon.28" />,
        modalName: ModalName.SlippageInfo,
        severity: WarningSeverity.None,
        title: t('swap.slippage.settings.title'),
        zIndex: zIndexes.popover,
      }}
      tooltipProps={{
        text: captionContent,
        maxWidth: 272,
        placement: 'top',
      }}
      analyticsTitle="Max Slippage"
    >
      {children}
    </WarningInfo>
  )
}
