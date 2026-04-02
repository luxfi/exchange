import { useTranslation } from 'react-i18next'
import { Flex, UniversalImage } from '@l.x/ui/src'
import { iconSizes } from '@l.x/ui/src/theme'
import { NotificationToast } from '@l.x/lx/src/components/notifications/NotificationToast'
import { getCountryFlagSvgUrl } from '@l.x/lx/src/features/fiatOnRamp/utils'
import { ChooseCountryNotification as ChooseCountryNotificationType } from '@l.x/lx/src/features/notifications/slice/types'

export function ChooseCountryNotification({
  notification: { countryName, countryCode, hideDelay },
}: {
  notification: ChooseCountryNotificationType
}): JSX.Element {
  const { t } = useTranslation()
  const countryFlagUrl = getCountryFlagSvgUrl(countryCode)
  return (
    <NotificationToast
      smallToast
      hideDelay={hideDelay}
      icon={
        <Flex borderRadius="$roundedFull" overflow="hidden">
          <UniversalImage
            size={{
              width: iconSizes.icon20,
              height: iconSizes.icon20,
            }}
            uri={countryFlagUrl}
            fallback={<Flex height={iconSizes.icon20} width={iconSizes.icon20} />}
          />
        </Flex>
      }
      title={t('notification.countryChange', { countryName })}
    />
  )
}
