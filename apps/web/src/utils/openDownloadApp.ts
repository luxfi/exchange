import { ElementName, InterfaceEventName } from 'lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'lx/src/features/telemetry/send'
import { AppDownloadPlatform } from 'lx/src/features/telemetry/types'
import { isWebAndroid, isWebIOS } from 'utilities/src/platform'

// Download links — redirect to Lux wallet download page
const APP_DOWNLOAD_LINKS: Partial<{ [key in ElementName]: string }> = {
  [ElementName.LuxWalletModalDownloadButton]: 'https://lux.exchange/wallet',
  [ElementName.LuxWalletNavbarMenuDownloadButton]: 'https://lux.exchange/wallet',
  [ElementName.LuxWalletLandingPageDownloadButton]: 'https://lux.exchange/wallet',
  [ElementName.LuxWalletBannerDownloadButton]: 'https://lux.exchange/wallet',
}

export const MICROSITE_LINK = 'https://lux.exchange/wallet'

type OpenDownloadAppOptions = {
  element: ElementName
}

/**
 * Note: openDownloadApp is equivalent to APP_DOWNLOAD_LINKS[element], the first just runs imperatively
 * and adds an analytics event, where the other only returns a link. Typically you'll use both:
 *
 * <a href={APP_DOWNLOAD_LINKS[element]} onClick={() => openDownloadApp(element)} />
 *
 * This way with JS disabled and when hovering the <a /> you see and nav to the full href properly,
 * but with JS on it will send the analytics event before navigating to the href.
 *
 * I've added a helper `getDownloadAppLinkProps` that unifies this behavior into one thing.
 */
export function openDownloadApp({ element }: OpenDownloadAppOptions) {
  if (isWebIOS) {
    openDownloadStore({ element, appPlatform: AppDownloadPlatform.Ios })
  } else if (isWebAndroid) {
    openDownloadStore({ element, appPlatform: AppDownloadPlatform.Android })
  } else {
    sendAnalyticsEvent(InterfaceEventName.LuxWalletMicrositeOpened, { element })
    window.open(APP_DOWNLOAD_LINKS[element], '_blank', 'noopener,noreferrer')
  }
}

type AnalyticsLinkOptions = {
  element: ElementName
  appPlatform?: AppDownloadPlatform
}

const openDownloadStore = (options: AnalyticsLinkOptions) => {
  sendAnalyticsEvent(InterfaceEventName.LuxWalletAppDownloadOpened, {
    element: options.element,
    appPlatform: options.appPlatform,
  })
  window.open(APP_DOWNLOAD_LINKS[options.element], '_blank', 'noopener,noreferrer')
}
