import { AppStackScreenProp } from 'src/app/navigation/types'
import { ReactNavigationModal } from 'src/components/modals/ReactNavigationModals/ReactNavigationModal'
<<<<<<< HEAD
import { ReportTokenIssueModal } from '@l.x/lx/src/components/reporting/ReportTokenIssueModal'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
=======
import { ReportTokenIssueModal } from 'uniswap/src/components/reporting/ReportTokenIssueModal'
import { ModalName } from 'uniswap/src/features/telemetry/constants'
>>>>>>> upstream/main

export const ReportTokenIssueModalScreen = (
  props: AppStackScreenProp<typeof ModalName.ReportTokenIssue>,
): JSX.Element => {
  return <ReactNavigationModal {...props} modalComponent={ReportTokenIssueModal} />
}
