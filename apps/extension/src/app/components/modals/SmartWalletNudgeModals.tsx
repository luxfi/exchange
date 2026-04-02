import { useDispatch } from 'react-redux'
import { useSmartWalletNudges } from 'src/app/context/SmartWalletNudgesContext'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { SmartWalletCreatedModal } from '@luxfi/wallet/src/components/smartWallet/modals/SmartWalletCreatedModal'
import { SmartWalletEnabledModal } from '@luxfi/wallet/src/components/smartWallet/modals/SmartWalletEnabledModal'
import { SmartWalletNudge } from '@luxfi/wallet/src/components/smartWallet/modals/SmartWalletNudge'
import { useActiveAccount } from '@luxfi/wallet/src/features/wallet/hooks'
import { setSmartWalletConsent } from '@luxfi/wallet/src/features/wallet/slice'

export function SmartWalletNudgeModals(): JSX.Element | null {
  const dispatch = useDispatch()
  const address = useActiveAccount()?.address
  const { activeModal, closeModal, openModal, dappInfo } = useSmartWalletNudges()

  if (!activeModal) {
    return null
  }

  switch (activeModal) {
    case ModalName.SmartWalletCreatedModal:
      return <SmartWalletCreatedModal isOpen onClose={closeModal} />
    case ModalName.SmartWalletNudge:
      return (
        <SmartWalletNudge
          isOpen
          onClose={closeModal}
          dappInfo={dappInfo}
          onEnableSmartWallet={() => {
            if (!address) {
              return
            }

            dispatch(setSmartWalletConsent({ address, smartWalletConsent: true }))
            openModal(ModalName.SmartWalletEnabledModal)
          }}
        />
      )
    case ModalName.SmartWalletEnabledModal:
      return <SmartWalletEnabledModal isOpen showReconnectDappPrompt={!!dappInfo} onClose={closeModal} />
    default:
      return null
  }
}
