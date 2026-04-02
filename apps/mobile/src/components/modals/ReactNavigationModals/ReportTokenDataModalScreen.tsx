import { AppStackScreenProp } from 'src/app/navigation/types'
import { ReactNavigationModal } from 'src/components/modals/ReactNavigationModals/ReactNavigationModal'
import { ReportTokenDataModal } from '@luxexchange/lx/src/components/reporting/ReportTokenDataModal'
import { ModalName } from '@luxexchange/lx/src/features/telemetry/constants'

export const ReportTokenDataModalScreen = (
  props: AppStackScreenProp<typeof ModalName.ReportTokenData>,
): JSX.Element => {
  return <ReactNavigationModal {...props} modalComponent={ReportTokenDataModal} />
}
