import { type InAppNotification } from '@luxfi/api'

export interface NotificationRenderer {
  // Render a notification and return cleanup function
  render(notification: InAppNotification): () => void
  // Check if a notification type can be rendered (e.g., only one modal at a time)
  canRender(notification: InAppNotification): boolean
}
