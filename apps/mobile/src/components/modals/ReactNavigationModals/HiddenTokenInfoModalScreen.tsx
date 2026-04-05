import { AppStackScreenProp } from 'src/app/navigation/types'
import { ReactNavigationModal } from 'src/components/modals/ReactNavigationModals/ReactNavigationModal'
<<<<<<< HEAD
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { HiddenTokenInfoModal } from '@l.x/lx/src/features/transactions/modals/HiddenTokenInfoModal'
=======
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { HiddenTokenInfoModal } from 'uniswap/src/features/transactions/modals/HiddenTokenInfoModal'
>>>>>>> upstream/main

export const HiddenTokenInfoModalScreen = (
  props: AppStackScreenProp<typeof ModalName.HiddenTokenInfoModal>,
): JSX.Element => {
  return <ReactNavigationModal {...props} modalComponent={HiddenTokenInfoModal} />
}
