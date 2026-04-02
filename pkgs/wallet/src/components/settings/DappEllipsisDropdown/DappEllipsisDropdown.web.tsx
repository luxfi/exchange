import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Flex } from '@luxfi/ui/src'
import { Power } from '@luxfi/ui/src/components/icons'
import { ContextMenu, MenuOptionItem } from '@l.x/lx/src/components/menus/ContextMenu'
import { ContextMenuTriggerMode } from '@l.x/lx/src/components/menus/types'
import { pushNotification } from '@l.x/lx/src/features/notifications/slice/slice'
import { AppNotificationType } from '@l.x/lx/src/features/notifications/slice/types'
import { ExtensionEventName } from '@l.x/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@l.x/lx/src/features/telemetry/send'
import { logger } from '@luxfi/utilities/src/logger/logger'
import { useBooleanState } from '@luxfi/utilities/src/react/useBooleanState'
import { type DappEllipsisDropdownProps } from '@luxfi/wallet/src/components/settings/DappEllipsisDropdown/DappEllipsisDropdown'
import { DappEllipsisDropdownIcon } from '@luxfi/wallet/src/components/settings/DappEllipsisDropdown/internal/DappEllipsisDropdownIcon'
import { useActiveAccountWithThrow } from '@luxfi/wallet/src/features/wallet/hooks'

const PowerCircle = (): JSX.Element => (
  <Flex centered backgroundColor="red" borderRadius="$roundedFull" p="$spacing2" pt="$spacing1">
    <Power color="white" size="$icon.16" />
  </Flex>
)

export function DappEllipsisDropdown({
  isEditing,
  setIsEditing,
  removeAllDappConnections,
}: DappEllipsisDropdownProps): JSX.Element {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { value: isMenuOpen, setTrue: openMenu, setFalse: closeMenu } = useBooleanState(false)

  const activeAccount = useActiveAccountWithThrow()

  if (isEditing !== undefined || setIsEditing) {
    logger.warn(
      'DappEllipsisDropdown.web.tsx',
      'render',
      '`isEditing` and/or `setIsEditing` are not expected to be defined',
    )
  }

  const menuOptions: MenuOptionItem[] = [
    {
      label: t('settings.setting.connections.disconnectAll'),
      onPress: async (): Promise<void> => {
        await removeAllDappConnections(activeAccount)
        sendAnalyticsEvent(ExtensionEventName.DappDisconnectAll, {
          activeConnectedAddress: activeAccount.address,
        })
        dispatch(
          pushNotification({
            type: AppNotificationType.Success,
            title: t('common.text.disconnected'),
          }),
        )
      },
      Icon: PowerCircle,
      destructive: true,
    },
  ]

  return (
    <ContextMenu
      menuItems={menuOptions}
      triggerMode={ContextMenuTriggerMode.Primary}
      isOpen={isMenuOpen}
      openMenu={openMenu}
      closeMenu={closeMenu}
      offsetY={2}
    >
      <DappEllipsisDropdownIcon />
    </ContextMenu>
  )
}
