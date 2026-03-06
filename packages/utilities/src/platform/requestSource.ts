import { isAndroid, isExtensionApp, isIOS } from 'utilities/src/platform'

/**
 * Returns the x-request-source header value for the current platform.
 * This header should be added to all requests to Lux services.
 */
function getRequestSource(): string {
  if (isIOS) {
    return 'lux-ios'
  }
  if (isAndroid) {
    return 'lux-android'
  }
  if (isExtensionApp) {
    return 'lux-extension'
  }
  return 'lux-web'
}

export const REQUEST_SOURCE = getRequestSource()
