import { AppStackScreenProp } from 'src/app/navigation/types'
import { ReactNavigationModal } from 'src/components/modals/ReactNavigationModals/ReactNavigationModal'
import { PasskeysHelpModal } from '@luxexchange/lx/src/features/passkey/PasskeysHelpModal'
import { ModalName } from '@luxexchange/lx/src/features/telemetry/constants'

export const PasskeyHelpModalScreen = (props: AppStackScreenProp<typeof ModalName.PasskeysHelp>): JSX.Element => {
  return <ReactNavigationModal {...props} modalComponent={PasskeysHelpModal} />
}
