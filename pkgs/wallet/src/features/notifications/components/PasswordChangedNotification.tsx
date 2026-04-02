import { useTranslation } from 'react-i18next'
import { SuccessNotification } from 'lx/src/components/notifications/notifications/SuccessNotification'
import { PasswordChangedNotification as PasswordChangedNotificationType } from 'lx/src/features/notifications/slice/types'

export function PasswordChangedNotification({
  notification: { hideDelay },
}: {
  notification: PasswordChangedNotificationType
}): JSX.Element {
  const { t } = useTranslation()
  return <SuccessNotification notification={{ title: t('notification.passwordChanged'), hideDelay }} />
}
