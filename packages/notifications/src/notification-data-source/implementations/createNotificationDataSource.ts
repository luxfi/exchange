import { type InAppNotification } from '@luxfi/api'
import { type NotificationDataSource } from '@luxfi/notifications/src/notification-data-source/NotificationDataSource'

/**
 * Basic implementation of the NotificationDataSource interface.
 */
export function createNotificationDataSource(ctx: {
  start: (onNotifications: (notifications: InAppNotification[], source: string) => void) => void
  stop: () => Promise<void>
}): NotificationDataSource {
  return {
    start: (onNotifications: (notifications: InAppNotification[], source: string) => void): void => {
      ctx.start(onNotifications)
    },
    stop: async (): Promise<void> => {
      await ctx.stop()
    },
  }
}
