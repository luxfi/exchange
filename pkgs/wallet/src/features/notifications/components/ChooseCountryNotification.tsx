import { useTranslation } from 'react-i18next'
import { Flex, UniversalImage } from 'ui/src'
import { iconSizes } from 'ui/src/theme'
import { NotificationToast } from 'lx/src/components/notifications/NotificationToast'
import { getCountryFlagSvgUrl } from 'lx/src/features/fiatOnRamp/utils'
import { ChooseCountryNotification as ChooseCountryNotificationType } from 'lx/src/features/notifications/slice/types'

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
