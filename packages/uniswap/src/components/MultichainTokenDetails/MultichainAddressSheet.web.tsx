import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Flex } from 'ui/src'
import { Modal } from 'uniswap/src/components/modals/Modal'
import { MultichainAddressList } from 'uniswap/src/components/MultichainTokenDetails/MultichainAddressList'
import type { MultichainAddressSheetProps } from 'uniswap/src/components/MultichainTokenDetails/MultichainAddressSheet'
import { pushNotification } from 'uniswap/src/features/notifications/slice/slice'
import { AppNotificationType, CopyNotificationType } from 'uniswap/src/features/notifications/slice/types'
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { setClipboard } from 'utilities/src/clipboard/clipboard'
import { isMobileWeb } from 'utilities/src/platform'

const COPY_CLOSE_DELAY = 750

export function MultichainAddressSheet({ isOpen, chains, onClose }: MultichainAddressSheetProps): JSX.Element | null {
  const dispatch = useDispatch()

  const handleCopyAddress = useCallback(
    async (address: string): Promise<void> => {
      await setClipboard(address)
      dispatch(pushNotification({ type: AppNotificationType.Copied, copyType: CopyNotificationType.Address }))
      if (isMobileWeb) {
        setTimeout(onClose, COPY_CLOSE_DELAY)
      } else {
        onClose()
      }
    },
    [dispatch, onClose],
  )

  if (!isOpen) {
    return null
  }

  return (
    <Modal
      name={ModalName.MultichainAddressModal}
      padding="$none"
      snapPoints={[65]}
      snapPointsMode="percent"
      onClose={onClose}
    >
      <Flex grow maxHeight="100%" overflow="hidden" px="$spacing24">
        <MultichainAddressList chains={chains} onCopyAddress={handleCopyAddress} />
      </Flex>
    </Modal>
  )
}
