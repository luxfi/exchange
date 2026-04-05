import { AppStackScreenProp } from 'src/app/navigation/types'
import { ReactNavigationModal } from 'src/components/modals/ReactNavigationModals/ReactNavigationModal'
<<<<<<< HEAD
import { BridgedAssetModal } from '@l.x/lx/src/components/BridgedAsset/BridgedAssetModal'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
=======
import { BridgedAssetModal } from 'uniswap/src/components/BridgedAsset/BridgedAssetModal'
import { ModalName } from 'uniswap/src/features/telemetry/constants'
>>>>>>> upstream/main

export const BridgedAssetModalScreen = (props: AppStackScreenProp<typeof ModalName.BridgedAsset>): JSX.Element => {
  return <ReactNavigationModal {...props} modalComponent={BridgedAssetModal} />
}
