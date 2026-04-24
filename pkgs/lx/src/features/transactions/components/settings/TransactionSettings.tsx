import type { ColorTokens, FlexProps, GeneratedIcon } from '@l.x/ui/src'
import { Flex, Popover, TouchableArea } from '@l.x/ui/src'
import { Settings } from '@l.x/ui/src/components/icons/Settings'
import type { IconSizeTokens } from '@l.x/ui/src/theme'
import { AccountType } from '@l.x/lx/src/features/accounts/types'
import { TransactionSettingsModalId } from '@l.x/lx/src/features/transactions/components/settings/stores/TransactionSettingsModalStore/createTransactionSettingsModalStore'
import {
  useModalHide,
  useModalShow,
  useModalVisibility,
} from '@l.x/lx/src/features/transactions/components/settings/stores/TransactionSettingsModalStore/useTransactionSettingsModalStore'
import { TransactionSettingsButton } from '@l.x/lx/src/features/transactions/components/settings/TransactionSettingsButton'
import { TransactionSettingsModal } from '@l.x/lx/src/features/transactions/components/settings/TransactionSettingsModal/TransactionSettingsModal'
import type { TransactionSettingConfig } from '@l.x/lx/src/features/transactions/components/settings/types'
import { ViewOnlyButton } from '@l.x/lx/src/features/transactions/components/settings/ViewOnlyButton'
import { ViewOnlyModal } from '@l.x/lx/src/features/transactions/modals/ViewOnlyModal'
import { useWallet } from '@l.x/lx/src/features/wallet/hooks/useWallet'
import { TestID } from '@l.x/lx/src/test/fixtures/testIDs'
import { dismissNativeKeyboard } from '@l.x/utils/src/device/keyboard/dismissNativeKeyboard'
import { isMobileApp, isWebApp } from '@l.x/utils/src/platform'
import { useEvent } from '@l.x/utils/src/react/hooks'

export interface TransactionSettingsProps {
  settings: TransactionSettingConfig[]
  adjustTopAlignment?: boolean
  adjustRightAlignment?: boolean
  position?: FlexProps['position']
  iconColor?: ColorTokens
  backgroundColor?: ColorTokens
  iconSize?: IconSizeTokens
  defaultTitle?: string
  shouldShowSettingsIconTooltip?: boolean
  IconLabel?: React.ReactNode
  CustomIconComponent?: GeneratedIcon
  testID?: string
  CustomSettingsButton?: React.ReactNode
  onClose?: () => void
}

export function TransactionSettings({
  settings,
  adjustTopAlignment = true,
  adjustRightAlignment = true,
  position = 'absolute',
  defaultTitle,
  CustomSettingsButton,
  testID,
  CustomIconComponent,
  iconColor = '$neutral2',
  backgroundColor,
  iconSize,
  IconLabel,
  onClose,
}: TransactionSettingsProps): JSX.Element {
  const account = useWallet().evmAccount
  const IconComponent = CustomIconComponent ?? Settings

  const isTransactionSettingsModalVisible = useModalVisibility(TransactionSettingsModalId.TransactionSettings)
  const handleShowTransactionSettingsModal = useModalShow(TransactionSettingsModalId.TransactionSettings)
  const handleHideTransactionSettingsModal = useModalHide(TransactionSettingsModalId.TransactionSettings)
  const isViewOnlyModalVisible = useModalVisibility(TransactionSettingsModalId.ViewOnly)
  const handleShowViewOnlyModal = useModalShow(TransactionSettingsModalId.ViewOnly)
  const handleHideViewOnlyModal = useModalHide(TransactionSettingsModalId.ViewOnly)

  const onCloseSettingsModal = useEvent((): void => {
    if (onClose) {
      onClose()
    } else {
      handleHideTransactionSettingsModal()
    }
  })

  const onPopoverOpenChange = useEvent((open: boolean): void => {
    // Only close on interface because SwapSettings are rendered in a modal on mobile/extension
    // and when click is triggered inside extension Modal it causes onOpenChange to trigger
    if (!open && isWebApp) {
      onCloseSettingsModal()
    }
  })

  const onPressTransactionSettings = useEvent((): void => {
    if (isTransactionSettingsModalVisible) {
      onCloseSettingsModal()
    } else {
      handleShowTransactionSettingsModal()
    }

    dismissNativeKeyboard()
  })

  const isViewOnlyWallet = account?.accountType === AccountType.Readonly

  const topAlignment = adjustTopAlignment ? (isWebApp ? -38 : 6) : 0
  const rightAlignment = adjustRightAlignment ? (isMobileApp ? 24 : 4) : 0
  const popoverOffset = isWebApp
    ? { crossAxis: adjustRightAlignment ? 0 : 8, mainAxis: adjustTopAlignment ? 0 : 8 }
    : undefined

  return (
    <>
      <ViewOnlyModal isOpen={isViewOnlyModalVisible} onDismiss={handleHideViewOnlyModal} />
      <Flex row gap="$spacing4" position={position} top={topAlignment} right={rightAlignment} zIndex="$default">
        {isViewOnlyWallet ? (
          <ViewOnlyButton onPress={handleShowViewOnlyModal} />
        ) : (
          <Popover
            offset={popoverOffset}
            placement="bottom-end"
            open={isTransactionSettingsModalVisible}
            onOpenChange={onPopoverOpenChange}
          >
            <Flex>
              <Popover.Trigger>
                <TouchableArea testID={testID ?? TestID.TransactionSettings} onPress={onPressTransactionSettings}>
                  {CustomSettingsButton ?? (
                    <TransactionSettingsButton
                      contentColor={iconColor}
                      backgroundColor={backgroundColor}
                      CustomIconComponent={IconComponent}
                      iconSize={iconSize}
                      IconLabel={IconLabel}
                    />
                  )}
                </TouchableArea>
              </Popover.Trigger>
              <TransactionSettingsModal
                settings={settings}
                defaultTitle={defaultTitle}
                isOpen={isTransactionSettingsModalVisible}
                onClose={onCloseSettingsModal}
              />
            </Flex>
          </Popover>
        )}
      </Flex>
    </>
  )
}
