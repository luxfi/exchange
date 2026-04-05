<<<<<<< HEAD
import { InterfaceEventName } from '@l.x/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@l.x/lx/src/features/telemetry/send'
=======
import { InterfaceEventName } from 'uniswap/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'uniswap/src/features/telemetry/send'
>>>>>>> upstream/main
import { anonymizeLink } from '~/utils/anonymizeLink'

/**
 * Fires ExternalLinkClicked analytics and opens the URL in a new tab with noopener,noreferrer.
 */
export function openExternalLink(href: string): void {
  sendAnalyticsEvent(InterfaceEventName.ExternalLinkClicked, {
    label: anonymizeLink(href),
  })
  window.open(href, '_blank', 'noopener,noreferrer')
}
