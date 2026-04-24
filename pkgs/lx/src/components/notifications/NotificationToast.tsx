import { NotificationContentProps } from '@l.x/lx/src/components/notifications/NotificationToastContent'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

export interface NotificationToastProps
  extends Omit<NotificationContentProps, 'onNotificationPress' | 'onActionButtonPress'> {
  address?: string
  hideDelay?: number // If omitted, the default delay time is used
}

export function NotificationToast(_props: NotificationToastProps): JSX.Element {
  throw new PlatformSplitStubError('NotificationToast')
}
