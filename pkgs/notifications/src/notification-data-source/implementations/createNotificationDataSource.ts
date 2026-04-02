import { type InAppNotification } from '@l.x/api'
import { type NotificationDataSource } from '@l.x/notifications/src/notification-data-source/NotificationDataSource'

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
