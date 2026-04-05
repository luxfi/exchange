import { AppStackScreenProp } from 'src/app/navigation/types'
import { ReactNavigationModal } from 'src/components/modals/ReactNavigationModals/ReactNavigationModal'
<<<<<<< HEAD
import { WormholeModal } from '@l.x/lx/src/components/BridgedAsset/WormholeModal'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
=======
import { WormholeModal } from 'uniswap/src/components/BridgedAsset/WormholeModal'
import { ModalName } from 'uniswap/src/features/telemetry/constants'
>>>>>>> upstream/main

export const WormholeModalScreen = (props: AppStackScreenProp<typeof ModalName.Wormhole>): JSX.Element => {
  return <ReactNavigationModal {...props} modalComponent={WormholeModal} />
}
