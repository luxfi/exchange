import { AppStackScreenProp } from 'src/app/navigation/types'
import { ReactNavigationModal } from 'src/components/modals/ReactNavigationModals/ReactNavigationModal'
<<<<<<< HEAD
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { TestnetModeModal } from '@l.x/lx/src/features/testnets/TestnetModeModal'
=======
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { TestnetModeModal } from 'uniswap/src/features/testnets/TestnetModeModal'
>>>>>>> upstream/main

export const TestnetModeModalScreen = (props: AppStackScreenProp<typeof ModalName.TestnetMode>): JSX.Element => {
  return <ReactNavigationModal {...props} modalComponent={TestnetModeModal} />
}
