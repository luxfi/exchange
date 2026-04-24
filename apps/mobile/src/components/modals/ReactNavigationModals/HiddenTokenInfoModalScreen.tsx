import { AppStackScreenProp } from 'src/app/navigation/types'
import { ReactNavigationModal } from 'src/components/modals/ReactNavigationModals/ReactNavigationModal'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { HiddenTokenInfoModal } from '@l.x/lx/src/features/transactions/modals/HiddenTokenInfoModal'

export const HiddenTokenInfoModalScreen = (
  props: AppStackScreenProp<typeof ModalName.HiddenTokenInfoModal>,
): JSX.Element => {
  return <ReactNavigationModal {...props} modalComponent={HiddenTokenInfoModal} />
}
