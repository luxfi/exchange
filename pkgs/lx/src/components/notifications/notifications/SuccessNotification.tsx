import { CheckmarkCircle } from '@l.x/ui/src/components/icons/CheckmarkCircle'
import { NotificationToast } from '@l.x/lx/src/components/notifications/NotificationToast'
import { AppNotificationDefault } from '@l.x/lx/src/features/notifications/slice/types'

export function SuccessNotification({
  notification: { hideDelay = 2000, title },
}: {
  notification: Pick<AppNotificationDefault, 'title' | 'hideDelay'>
}): JSX.Element | null {
  return <NotificationToast smallToast hideDelay={hideDelay} icon={<CheckmarkCircle size="$icon.16" />} title={title} />
}
