import { AppStackScreenProp } from 'src/app/navigation/types'
import { useReactNavigationModal } from 'src/components/modals/useReactNavigationModal'
import { ExchangeTransferConnecting } from 'src/screens/ExchangeTransferConnecting'
import { Modal } from 'lx/src/components/modals/Modal'
import { ModalName } from 'lx/src/features/telemetry/constants'

export function ExchangeTransferModal({
  route,
}: AppStackScreenProp<typeof ModalName.ExchangeTransferModal>): JSX.Element | null {
  const { onClose } = useReactNavigationModal()
  const serviceProvider = route.params.initialState.serviceProvider

  return (
    <Modal
      fullScreen
      hideHandlebar
      hideKeyboardOnDismiss
      renderBehindTopInset
      name={ModalName.ExchangeTransferModal}
      onClose={onClose}
    >
      <ExchangeTransferConnecting serviceProvider={serviceProvider} onClose={onClose} />
    </Modal>
  )
}
