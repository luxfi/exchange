import { AppStackScreenProp } from 'src/app/navigation/types'
import { ReactNavigationModal } from 'src/components/modals/ReactNavigationModals/ReactNavigationModal'
import { BridgedAssetModal } from '@l.x/lx/src/components/BridgedAsset/BridgedAssetModal'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'

export const BridgedAssetModalScreen = (props: AppStackScreenProp<typeof ModalName.BridgedAsset>): JSX.Element => {
  return <ReactNavigationModal {...props} modalComponent={BridgedAssetModal} />
}
