import { AppStackScreenProp } from 'src/app/navigation/types'
import { ReactNavigationModal } from 'src/components/modals/ReactNavigationModals/ReactNavigationModal'
<<<<<<< HEAD
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { SmartWalletEnabledModal } from '@luxfi/wallet/src/components/smartWallet/modals/SmartWalletEnabledModal'
=======
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { SmartWalletEnabledModal } from 'wallet/src/components/smartWallet/modals/SmartWalletEnabledModal'
>>>>>>> upstream/main

export const SmartWalletEnabledModalScreen = (
  props: AppStackScreenProp<typeof ModalName.SmartWalletEnabledModal>,
): JSX.Element => {
  return <ReactNavigationModal {...props} modalComponent={SmartWalletEnabledModal} />
}
