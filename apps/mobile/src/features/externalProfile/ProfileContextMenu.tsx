import { SharedEventName } from '@luxamm/analytics-events'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { NativeSyntheticEvent, Share } from 'react-native'
import ContextMenu, { ContextMenuOnPressNativeEvent } from 'react-native-context-menu-view'
import { useDispatch } from 'react-redux'
import { TouchableArea } from '@l.x/ui/src'
import { Ellipsis } from '@l.x/ui/src/components/icons'
import { uniswapUrls } from '@l.x/lx/src/constants/urls'
import { useUnitagsAddressQuery } from '@l.x/lx/src/data/apiClients/unitagsApi/useUnitagsAddressQuery'
import { getChainInfo } from '@l.x/lx/src/features/chains/chainInfo'
import { useEnabledChains } from '@l.x/lx/src/features/chains/hooks/useEnabledChains'
import { pushNotification } from '@l.x/lx/src/features/notifications/slice/slice'
import { AppNotificationType, CopyNotificationType } from '@l.x/lx/src/features/notifications/slice/types'
import { ElementName, WalletEventName } from '@l.x/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@l.x/lx/src/features/telemetry/send'
import { MobileScreens } from '@l.x/lx/src/types/screens/mobile'
import { ShareableEntity } from '@l.x/lx/src/types/sharing'
import { ExplorerDataType, getExplorerLink, getPortfolioUrl, openUri } from '@l.x/lx/src/utils/linking'
import { setClipboard } from '@l.x/utils/src/clipboard/clipboard'
import { logger } from '@l.x/utils/src/logger/logger'
import { noop } from '@l.x/utils/src/react/noop'

type MenuAction = {
  title: string
  action: () => void
  systemIcon: string
}

export function ProfileContextMenu({ address }: { address: Address }): JSX.Element {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { data: unitag } = useUnitagsAddressQuery({
    params: address ? { address } : undefined,
  })
  const { defaultChainId } = useEnabledChains()

  const onPressCopyAddress = useCallback(async () => {
    if (!address) {
      return
    }

    await setClipboard(address)
    dispatch(pushNotification({ type: AppNotificationType.Copied, copyType: CopyNotificationType.Address }))
    sendAnalyticsEvent(SharedEventName.ELEMENT_CLICKED, {
      element: ElementName.CopyAddress,
      screen: MobileScreens.ExternalProfile,
    })
  }, [address, dispatch])

  const openExplorerLink = useCallback(async () => {
    await openUri({
      uri: getExplorerLink({ chainId: defaultChainId, data: address, type: ExplorerDataType.ADDRESS }),
    })
  }, [address, defaultChainId])

  const onReportProfile = useCallback(async () => {
    const params = new URLSearchParams()
    params.append('tf_11041337007757', address) // Wallet Address
    params.append('tf_7005922218125', 'report_unitag') // Report Type Dropdown
    const prefilledRequestUrl = uniswapUrls.helpRequestUrl + '?' + params.toString()
    openUri({ uri: prefilledRequestUrl }).catch((e) =>
      logger.error(e, { tags: { file: 'ProfileContextMenu', function: 'reportProfileLink' } }),
    )
  }, [address])

  const onPressShare = useCallback(async () => {
    if (!address) {
      return
    }
    try {
      const url = getPortfolioUrl(address)
      await Share.share({
        message: url,
      })
      sendAnalyticsEvent(WalletEventName.ShareButtonClicked, {
        entity: ShareableEntity.Wallet,
        url,
      })
    } catch (error) {
      logger.error(error, { tags: { file: 'ProfileContextMenu', function: 'onPressShare' } })
    }
  }, [address])

  const menuActions = useMemo(() => {
    const options: MenuAction[] = [
      {
        title: t('account.wallet.action.viewExplorer', {
          blockExplorerName: getChainInfo(defaultChainId).explorer.name,
        }),
        action: openExplorerLink,
        systemIcon: 'link',
      },
      {
        title: t('account.wallet.action.copy'),
        action: onPressCopyAddress,
        systemIcon: 'square.on.square',
      },
      {
        title: t('common.button.share'),
        action: onPressShare,
        systemIcon: 'square.and.arrow.up',
      },
    ]
    if (unitag) {
      options.push({
        title: t('account.wallet.action.report'),
        action: onReportProfile,
        systemIcon: 'flag',
      })
    }
    return options
  }, [onPressCopyAddress, onPressShare, onReportProfile, openExplorerLink, t, unitag, defaultChainId])

  return (
    <ContextMenu
      actions={menuActions}
      dropdownMenuMode={true}
      onPress={async (e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>): Promise<void> => {
        await menuActions[e.nativeEvent.index]?.action()
      }}
    >
      <TouchableArea centered backgroundColor="$surface4" borderRadius="$roundedFull" p="$spacing8" onLongPress={noop}>
        <Ellipsis color="$neutral2" size="$icon.16" />
      </TouchableArea>
    </ContextMenu>
  )
}
