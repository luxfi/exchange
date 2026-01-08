import { createNotificationTelemetry, type NotificationTelemetry } from '@luxfi/notifications'
import { InterfaceEventName } from 'lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'lx/src/features/telemetry/send'

/**
 * Creates a NotificationTelemetry implementation that sends events to Amplitude
 * via the existing web analytics infrastructure.
 */
export function getNotificationTelemetry(): NotificationTelemetry {
  return createNotificationTelemetry({
    onNotificationReceived(params) {
      sendAnalyticsEvent(InterfaceEventName.NotificationReceived, {
        notification_id: params.notificationId,
        notification_type: params.type,
        source: params.source,
        timestamp: params.timestamp,
      })
    },

    onNotificationShown(params) {
      sendAnalyticsEvent(InterfaceEventName.NotificationShown, {
        notification_id: params.notificationId,
        notification_type: params.type,
        timestamp: params.timestamp,
      })
    },

    onNotificationInteracted(params) {
      sendAnalyticsEvent(InterfaceEventName.NotificationInteracted, {
        notification_id: params.notificationId,
        notification_type: params.type,
        action: params.action,
      })
    },
  })
}
