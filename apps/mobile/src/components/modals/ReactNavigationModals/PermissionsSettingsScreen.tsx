import { AppStackScreenProp } from 'src/app/navigation/types'
import { ReactNavigationModal } from 'src/components/modals/ReactNavigationModals/ReactNavigationModal'
<<<<<<< HEAD
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { PermissionsModal } from '@luxfi/wallet/src/components/settings/permissions/PermissionsModal'
=======
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { PermissionsModal } from 'wallet/src/components/settings/permissions/PermissionsModal'
>>>>>>> upstream/main

export const PermissionsSettingsScreen = (
  props: AppStackScreenProp<typeof ModalName.PermissionsModal>,
): JSX.Element => {
  return <ReactNavigationModal {...props} modalComponent={PermissionsModal} />
}
