import { AppStackScreenProp } from 'src/app/navigation/types'
import { ReactNavigationModal } from 'src/components/modals/ReactNavigationModals/ReactNavigationModal'
<<<<<<< HEAD
import { PasskeyManagementModal } from '@l.x/lx/src/features/passkey/PasskeyManagementModal'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
=======
import { PasskeyManagementModal } from 'uniswap/src/features/passkey/PasskeyManagementModal'
import { ModalName } from 'uniswap/src/features/telemetry/constants'
>>>>>>> upstream/main

export const PasskeyManagementModalScreen = (
  props: AppStackScreenProp<typeof ModalName.PasskeyManagement>,
): JSX.Element => {
  return <ReactNavigationModal {...props} modalComponent={PasskeyManagementModal} />
}
