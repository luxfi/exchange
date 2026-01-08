import { CheckmarkCircle } from 'ui/src/components/icons/CheckmarkCircle'
import { NotificationToast } from 'lx/src/components/notifications/NotificationToast'
import { AppNotificationDefault } from 'lx/src/features/notifications/slice/types'

export function SuccessNotification({
  notification: { hideDelay = 2000, title },
}: {
  notification: Pick<AppNotificationDefault, 'title' | 'hideDelay'>
}): JSX.Element | null {
  return <NotificationToast smallToast hideDelay={hideDelay} icon={<CheckmarkCircle size="$icon.16" />} title={title} />
}
