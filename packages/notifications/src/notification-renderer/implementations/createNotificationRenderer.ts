import { type InAppNotification } from '@luxfi/api'
import { type NotificationRenderer } from '@luxfi/notifications/src/notification-renderer/NotificationRenderer'

export function createNotificationRenderer(ctx: {
  render: (notification: InAppNotification) => () => void
  canRender: (notification: InAppNotification) => boolean
}): NotificationRenderer {
  return {
    render: (notification: InAppNotification): (() => void) => {
      return ctx.render(notification)
    },
    canRender: (notification: InAppNotification): boolean => {
      return ctx.canRender(notification)
    },
  }
}
