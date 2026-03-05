import { NotificationToast } from 'lx/src/components/notifications/NotificationToast'
import { AppNotificationDefault } from 'lx/src/features/notifications/slice/types'

export function DefaultNotification({
  notification: { address, title, hideDelay },
}: {
  notification: AppNotificationDefault
}): JSX.Element {
  return <NotificationToast address={address} hideDelay={hideDelay} title={title} />
}
