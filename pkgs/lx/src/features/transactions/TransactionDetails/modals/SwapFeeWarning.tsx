import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, TouchableArea, useSporeColors } from '@l.x/ui/src'
import { AlertCircleFilled } from '@l.x/ui/src/components/icons/AlertCircleFilled'
import { zIndexes } from '@l.x/ui/src/theme'
import { WarningSeverity } from '@l.x/lx/src/components/modals/WarningModal/types'
import { WarningInfo } from '@l.x/lx/src/components/modals/WarningModal/WarningInfo'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { openUri } from '@l.x/lx/src/utils/linking'
import { isWebPlatform } from '@l.x/utils/src/platform'

export function SwapFeeWarning({
  noLuxInterfaceFees,
  noFeeOnThisSwap,
  children,
  isJupiter,
}: PropsWithChildren<{ noLxInterfaceFees: boolean; noFeeOnThisSwap: boolean; isJupiter: boolean }>): JSX.Element {
  const colors = useSporeColors()
  const { t } = useTranslation()

  const onPressLearnMore = async (): Promise<void> => {
    await openUri({ uri: lxUrls.helpArticleUrls.swapFeeInfo })
  }

  const caption =
    noLuxInterfaceFees && !isJupiter
      ? t('swap.warning.noInterfaceFees.message')
      : noFeeOnThisSwap
        ? t('swap.warning.lxFee.message.default')
        : isJupiter
          ? t('swap.fees.jupiter.message')
          : t('swap.warning.lxFee.message.included')

  return (
    <WarningInfo
      infoButton={
        <TouchableArea onPress={onPressLearnMore}>
          <Text color="$neutral1" variant={isWebPlatform ? 'body4' : 'buttonLabel2'}>
            {t('common.button.learn')}
          </Text>
        </TouchableArea>
      }
      modalProps={{
        icon: <AlertCircleFilled color="$neutral1" size="$icon.20" />,
        backgroundIconColor: colors.surface2.get(),
        captionComponent: (
          <Text
            color="$neutral2"
            textAlign={isWebPlatform ? 'left' : 'center'}
            variant={isWebPlatform ? 'body4' : 'body2'}
          >
            {caption}
          </Text>
        ),
        rejectText: t('common.button.close'),
        modalName: ModalName.NetworkFeeInfo,
        severity: WarningSeverity.None,
        title: t('swap.warning.luxFee.title'),
        zIndex: zIndexes.popover,
      }}
      tooltipProps={{ text: caption, placement: 'top' }}
      analyticsTitle="Swap fee"
    >
      {children}
    </WarningInfo>
  )
}
