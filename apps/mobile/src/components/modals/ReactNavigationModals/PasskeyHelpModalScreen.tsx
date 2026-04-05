import { AppStackScreenProp } from 'src/app/navigation/types'
import { ReactNavigationModal } from 'src/components/modals/ReactNavigationModals/ReactNavigationModal'
<<<<<<< HEAD
import { PasskeysHelpModal } from '@l.x/lx/src/features/passkey/PasskeysHelpModal'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
=======
import { PasskeysHelpModal } from 'uniswap/src/features/passkey/PasskeysHelpModal'
import { ModalName } from 'uniswap/src/features/telemetry/constants'
>>>>>>> upstream/main

export const PasskeyHelpModalScreen = (props: AppStackScreenProp<typeof ModalName.PasskeysHelp>): JSX.Element => {
  return <ReactNavigationModal {...props} modalComponent={PasskeysHelpModal} />
}
