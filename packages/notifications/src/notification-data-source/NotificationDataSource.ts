import { type InAppNotification } from '@luxfi/api'

export interface NotificationDataSource {
  // Start receiving notifications (implementation determines mechanism: fetch, websocket, polling, etc.)
  start(onNotifications: (notifications: InAppNotification[], source: string) => void): void
  // Stop receiving notifications and cleanup
  stop(): Promise<void>
}
