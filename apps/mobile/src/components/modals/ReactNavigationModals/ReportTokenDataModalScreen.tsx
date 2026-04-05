import { AppStackScreenProp } from 'src/app/navigation/types'
import { ReactNavigationModal } from 'src/components/modals/ReactNavigationModals/ReactNavigationModal'
<<<<<<< HEAD
import { ReportTokenDataModal } from '@l.x/lx/src/components/reporting/ReportTokenDataModal'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
=======
import { ReportTokenDataModal } from 'uniswap/src/components/reporting/ReportTokenDataModal'
import { ModalName } from 'uniswap/src/features/telemetry/constants'
>>>>>>> upstream/main

export const ReportTokenDataModalScreen = (
  props: AppStackScreenProp<typeof ModalName.ReportTokenData>,
): JSX.Element => {
  return <ReactNavigationModal {...props} modalComponent={ReportTokenDataModal} />
}
