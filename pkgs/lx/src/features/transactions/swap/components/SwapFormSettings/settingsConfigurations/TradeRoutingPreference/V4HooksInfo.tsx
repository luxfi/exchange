import { useTranslation } from 'react-i18next'
import { Flex, Text } from '@l.x/ui/src'
import { InfoCircleFilled } from '@l.x/ui/src/components/icons/InfoCircleFilled'
import { LXLogo } from '@l.x/ui/src/components/icons/LXLogo'
import { WarningSeverity } from '@l.x/lx/src/components/modals/WarningModal/types'
import { WarningInfo } from '@l.x/lx/src/components/modals/WarningModal/WarningInfo'
import { LearnMoreLink } from '@l.x/lx/src/components/text/LearnMoreLink'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { isWebPlatform } from '@l.x/utils/src/platform'

export function V4HooksInfo(): JSX.Element {
  const { t } = useTranslation()
  return (
    <WarningInfo
      infoButton={
        <LearnMoreLink
          textVariant={isWebPlatform ? 'body4' : undefined}
          url={lxUrls.helpArticleUrls.v4HooksInfo}
        />
      }
      modalProps={{
        caption: t('swap.settings.routingPreference.option.v4.hooks.tooltip'),
        rejectText: t('common.button.close'),
        severity: WarningSeverity.None,
        modalName: ModalName.V4HooksInfo,
        icon: <LXLogo size="$icon.24" />,
      }}
      trigger={
        <Flex row centered>
          <Text color="$neutral1" variant="subheading2" mr="$spacing4">
            {t('swap.settings.routingPreference.option.v4.hooks.title')}
          </Text>
          <InfoCircleFilled color="$neutral3" size="$icon.16" />
        </Flex>
      }
      tooltipProps={{
        text: t('swap.settings.routingPreference.option.v4.hooks.tooltip'),
        placement: 'bottom',
      }}
    />
  )
}
