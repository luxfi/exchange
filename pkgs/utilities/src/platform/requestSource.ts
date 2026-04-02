import { isAndroid, isExtensionApp, isIOS } from '@luxfi/utilities/src/platform'

/**
 * Returns the x-request-source header value for the current platform.
 * This header should be added to all requests to Lx services.
 */
function getRequestSource(): string {
  if (isIOS) {
    return 'lx-ios'
  }
  if (isAndroid) {
    return 'lx-android'
  }
  if (isExtensionApp) {
    return 'lx-extension'
  }
  return 'lx-web'
}

export const REQUEST_SOURCE = getRequestSource()
