import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Flex } from '@l.x/ui/src'
import { CopyAlt } from '@l.x/ui/src/components/icons/CopyAlt'
import { Person } from '@l.x/ui/src/components/icons/Person'
import { InfoRow } from '@l.x/lx/src/components/activity/details/InfoRow'
import { TransactionParticipantDisplay } from '@l.x/lx/src/components/activity/details/TransactionParticipantDisplay'
import { TransactionParticipantRowProps } from '@l.x/lx/src/components/activity/details/types'
import { ContextMenu, MenuOptionItem } from '@l.x/lx/src/components/menus/ContextMenu'
import { ContextMenuTriggerMode } from '@l.x/lx/src/components/menus/types'
import { useLuxContext } from '@l.x/lx/src/contexts/LuxContext'
import { pushNotification } from '@l.x/lx/src/features/notifications/slice/slice'
import { AppNotificationType, CopyNotificationType } from '@l.x/lx/src/features/notifications/slice/types'
import { setClipboard } from '@l.x/utils/src/clipboard/clipboard'
import { useBooleanState } from '@l.x/utils/src/react/useBooleanState'

export function TransactionParticipantRow({
  address,
  isSend = false,
  onClose,
}: TransactionParticipantRowProps): JSX.Element {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { navigateToExternalProfile } = useLuxContext()

  const { value: isContextMenuOpen, setTrue: openContextMenu, setFalse: closeContextMenu } = useBooleanState(false)

  const onCopyAddress = async (): Promise<void> => {
    await setClipboard(address)
    dispatch(
      pushNotification({
        type: AppNotificationType.Copied,
        copyType: CopyNotificationType.Address,
      }),
    )
  }

  const onViewProfile = (): void => {
    navigateToExternalProfile({ address })
    onClose()
  }

  const options: MenuOptionItem[] = [
    {
      label: t('common.copy.address'),
      onPress: onCopyAddress,
      Icon: CopyAlt,
    },
    {
      label: t('common.view.profile'),
      onPress: onViewProfile,
      Icon: Person,
    },
  ]

  return (
    <InfoRow label={isSend ? t('common.text.recipient') : t('common.text.sender')}>
      <Flex>
        <ContextMenu
          isPlacementAbove
          menuItems={options}
          triggerMode={ContextMenuTriggerMode.Primary}
          isOpen={isContextMenuOpen}
          closeMenu={closeContextMenu}
          openMenu={openContextMenu}
        >
          <TransactionParticipantDisplay address={address} />
        </ContextMenu>
      </Flex>
    </InfoRow>
  )
}
