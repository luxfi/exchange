import { AppStackScreenProp } from 'src/app/navigation/types'
import { ReactNavigationModal } from 'src/components/modals/ReactNavigationModals/ReactNavigationModal'
import { PasskeyManagementModal } from '@l.x/lx/src/features/passkey/PasskeyManagementModal'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'

export const PasskeyManagementModalScreen = (
  props: AppStackScreenProp<typeof ModalName.PasskeyManagement>,
): JSX.Element => {
  return <ReactNavigationModal {...props} modalComponent={PasskeyManagementModal} />
}
