import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useCallback, useMemo } from 'react'
import { useWindowDimensions } from 'react-native'
import { useDispatch } from 'react-redux'
import { spacing } from 'ui/src/theme'
import { Modal } from 'uniswap/src/components/modals/Modal'
import { MultichainAddressList } from 'uniswap/src/components/MultichainTokenDetails/MultichainAddressList'
import type { MultichainAddressSheetProps } from 'uniswap/src/components/MultichainTokenDetails/MultichainAddressSheet'
import { pushNotification } from 'uniswap/src/features/notifications/slice/slice'
import { AppNotificationType, CopyNotificationType } from 'uniswap/src/features/notifications/slice/types'
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { setClipboard } from 'utilities/src/clipboard/clipboard'

const MIN_SHEET_HEIGHT = 520
const INITIAL_SNAP_PERCENT = 0.65
const SCROLL_CONTENT_STYLE = { paddingHorizontal: spacing.spacing24 }

export function MultichainAddressSheet({ isOpen, chains, onClose }: MultichainAddressSheetProps): JSX.Element | null {
  const { height: screenHeight } = useWindowDimensions()
  const dispatch = useDispatch()

  const snapPoints = useMemo(() => {
    const percentHeight = INITIAL_SNAP_PERCENT * screenHeight
    const initialSnap = Math.min(Math.max(percentHeight, MIN_SHEET_HEIGHT), screenHeight)
    return [initialSnap, '100%']
  }, [screenHeight])

  const handleCopyAddress = useCallback(
    async (address: string): Promise<void> => {
      await setClipboard(address)
      dispatch(pushNotification({ type: AppNotificationType.Copied, copyType: CopyNotificationType.Address }))
      onClose()
    },
    [dispatch, onClose],
  )

  if (!isOpen) {
    return null
  }

  return (
    <Modal
      fullScreen
      overrideInnerContainer
      name={ModalName.MultichainAddressModal}
      snapPoints={snapPoints}
      onClose={onClose}
    >
      <BottomSheetScrollView contentContainerStyle={SCROLL_CONTENT_STYLE} showsVerticalScrollIndicator={false}>
        <MultichainAddressList
          renderedInModal
          chains={chains}
          showInlineFeedback={false}
          onCopyAddress={handleCopyAddress}
        />
      </BottomSheetScrollView>
    </Modal>
  )
}
