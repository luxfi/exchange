<<<<<<< HEAD
import { createNotificationTelemetry, type NotificationTelemetry } from '@luxfi/notifications'
import { InterfaceEventName } from '@l.x/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@l.x/lx/src/features/telemetry/send'
=======
import { createNotificationTelemetry, type NotificationTelemetry } from '@universe/notifications'
import { InterfaceEventName } from 'uniswap/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'uniswap/src/features/telemetry/send'
>>>>>>> upstream/main

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
