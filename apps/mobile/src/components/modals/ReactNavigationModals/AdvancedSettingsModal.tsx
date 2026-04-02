import { AppStackScreenProp } from 'src/app/navigation/types'
import { ReactNavigationModal } from 'src/components/modals/ReactNavigationModals/ReactNavigationModal'
import { ModalName } from '@luxexchange/lx/src/features/telemetry/constants'
import { SmartWalletAdvancedSettingsModal } from '@luxfi/wallet/src/components/smartWallet/modals/SmartWalletAdvancedSettingsModal'

export const AdvancedSettingsModal = (
  props: AppStackScreenProp<typeof ModalName.SmartWalletAdvancedSettingsModal>,
): JSX.Element => {
  return <ReactNavigationModal {...props} modalComponent={SmartWalletAdvancedSettingsModal} />
}
