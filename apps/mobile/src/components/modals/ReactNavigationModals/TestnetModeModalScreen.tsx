import { AppStackScreenProp } from 'src/app/navigation/types'
import { ReactNavigationModal } from 'src/components/modals/ReactNavigationModals/ReactNavigationModal'
import { ModalName } from 'lx/src/features/telemetry/constants'
import { TestnetModeModal } from 'lx/src/features/testnets/TestnetModeModal'

export const TestnetModeModalScreen = (props: AppStackScreenProp<typeof ModalName.TestnetMode>): JSX.Element => {
  return <ReactNavigationModal {...props} modalComponent={TestnetModeModal} />
}
