import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { LXText } from 'ui/src'
import { LX } from 'ui/src/components/icons/LX'
import { colors, opacify, zIndexes } from 'ui/src/theme'
import { WarningSeverity } from 'lx/src/components/modals/WarningModal/types'
import { WarningInfo } from 'lx/src/components/modals/WarningModal/WarningInfo'
import { LearnMoreLink } from 'lx/src/components/text/LearnMoreLink'
import type { InfoTooltipProps } from 'lx/src/components/tooltip/InfoTooltipProps'
import { lxUrls } from 'lx/src/constants/urls'
import { ModalName } from 'lx/src/features/telemetry/constants'
import { isWebPlatform } from 'utilities/src/platform'

export function LxSwapInfo({
  children,
  tooltipTrigger,
  placement = 'top',
}: PropsWithChildren<{
  tooltipTrigger?: InfoTooltipProps['trigger']
  placement?: InfoTooltipProps['placement']
}>): JSX.Element {
  const { t } = useTranslation()

  return (
    <WarningInfo
      infoButton={
        <LearnMoreLink
          textVariant={isWebPlatform ? 'body4' : undefined}
          url={lxUrls.helpArticleUrls.lxSwapInfo}
        />
      }
      modalProps={{
        backgroundIconColor: opacify(16, colors.lxSwapPurple),
        caption: t('lx.description'),
        rejectText: t('common.button.close'),
        icon: <LX size="$icon.24" />,
        modalName: ModalName.LxSwapInfo,
        severity: WarningSeverity.None,
        titleComponent: (
          <LXText variant={isWebPlatform ? 'subheading2' : 'body1'}>{t('lx.label')}</LXText>
        ),
        zIndex: zIndexes.popover,
      }}
      tooltipProps={{
        text: t('lx.description'),
        placement,
        icon: <LX size="$icon.24" />,
      }}
      trigger={tooltipTrigger}
      analyticsTitle="LX info"
    >
      {children}
    </WarningInfo>
  )
}
