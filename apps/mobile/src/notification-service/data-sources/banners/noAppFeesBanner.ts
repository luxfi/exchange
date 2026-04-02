import {
  Background,
  Content,
  Notification,
  NotificationVersion,
  OnClick,
} from '@luxamm/client-notification-service/dist/lx/notificationservice/v1/api_pb'
import { BackgroundType, ContentStyle, type InAppNotification, OnClickAction } from '@l.x/api'
import { FeatureFlags, getFeatureFlag } from '@l.x/gating'
import { BannerId } from 'src/notification-service/data-sources/banners/types'
import {
  NO_FEES_ICON,
  NO_LUX_INTERFACE_FEES_BANNER_DARK,
  NO_LUX_INTERFACE_FEES_BANNER_LIGHT,
} from '@luxfi/ui/src/assets'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import i18n from '@l.x/lx/src/i18n'

/**
 * Check if No App Fees banner should be shown based on feature flag.
 * The processor will filter based on tracked state.onNavigate
 */
export async function checkNoAppFeesBanner(isDarkMode: boolean): Promise<InAppNotification | null> {
  const isEnabled = getFeatureFlag(FeatureFlags.NoLuxInterfaceFees)

  if (!isEnabled) {
    return null
  }

  return createNoAppFeesBanner(isDarkMode)
}

/**
 * Create No App Fees banner notification
 */
function createNoAppFeesBanner(isDarkMode: boolean): InAppNotification {
  return new Notification({
    id: BannerId.NoAppFees,
    content: new Content({
      version: NotificationVersion.V0,
      style: ContentStyle.LOWER_LEFT_BANNER,
      title: i18n.t('notification.noAppFees.title'),
      subtitle: i18n.t('notification.noAppFees.subtitle'),
      iconLink: NO_FEES_ICON,
      background: new Background({
        backgroundType: BackgroundType.IMAGE,
        link: isDarkMode ? NO_LUX_INTERFACE_FEES_BANNER_DARK : NO_LUX_INTERFACE_FEES_BANNER_LIGHT,
        backgroundOnClick: new OnClick({
          onClick: [OnClickAction.EXTERNAL_LINK, OnClickAction.DISMISS, OnClickAction.ACK],
          onClickLink: lxUrls.helpArticleUrls.swapFeeInfo,
        }),
      }),
      onDismissClick: new OnClick({
        onClick: [OnClickAction.DISMISS, OnClickAction.ACK],
      }),
      buttons: [],
      extra: JSON.stringify({ cardType: 'dismissible', graphicType: 'gradient' }),
    }),
  })
}
