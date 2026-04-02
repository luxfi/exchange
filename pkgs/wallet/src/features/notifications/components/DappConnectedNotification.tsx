import { useTranslation } from 'react-i18next'
import { UniversalImage } from '@l.x/ui/src'
import { borderRadii, iconSizes } from '@l.x/ui/src/theme'
import { NotificationToast } from '@l.x/lx/src/components/notifications/NotificationToast'
import { DappConnectedNotification as DappConnectedNotificationType } from '@l.x/lx/src/features/notifications/slice/types'

export function DappConnectedNotification({
  notification: { hideDelay = 2000, dappIconUrl },
}: {
  notification: DappConnectedNotificationType
}): JSX.Element | null {
  const { t } = useTranslation()

  return (
    <NotificationToast
      smallToast
      hideDelay={hideDelay}
      icon={
        dappIconUrl ? (
          <UniversalImage
            uri={dappIconUrl}
            style={{ image: { borderRadius: borderRadii.rounded8 } }}
            size={{
              width: iconSizes.icon20,
              height: iconSizes.icon20,
            }}
          />
        ) : undefined
      }
      title={t('common.text.connected')}
    />
  )
}
