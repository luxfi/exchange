import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { ChartBarCrossed } from 'ui/src/components/icons/ChartBarCrossed'
import { BaseModalProps } from 'uniswap/src/components/BridgedAsset/BridgedAssetModal'
import { ReportModal, ReportOption } from 'uniswap/src/components/reporting/ReportModal'
import { pushNotification } from 'uniswap/src/features/notifications/slice/slice'
import { AppNotificationType } from 'uniswap/src/features/notifications/slice/types'
import { PortfolioDataReportOption, submitPortfolioDataReport } from 'uniswap/src/features/reporting/reports'
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { useEvent } from 'utilities/src/react/hooks'

export type ReportPortfolioDataModalProps = {
  onReportSuccess?: () => void
}

export function ReportPortfolioDataModal({
  isOpen,
  onReportSuccess,
  onClose,
}: ReportPortfolioDataModalProps & BaseModalProps): JSX.Element {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const submitReport = useEvent(
    ({
      checkedItems,
      reportTexts,
    }: {
      checkedItems: Set<PortfolioDataReportOption>
      reportTexts: Map<PortfolioDataReportOption, string>
    }) => {
      submitPortfolioDataReport({
        reportOptions: Array.from(checkedItems),
        reportTexts,
      })

      onReportSuccess?.()
      dispatch(
        pushNotification({
          type: AppNotificationType.Success,
          title: t('common.reported'),
        }),
      )
      onClose()
    },
  )

  const reportOptions: ReportOption<PortfolioDataReportOption>[] = useMemo(
    () => [
      {
        title: t('reporting.portfolio.data.options.performance.title'),
        subtitle: t('reporting.portfolio.data.options.performance.subtitle'),
        value: PortfolioDataReportOption.Performance,
        additionalTextInput: true,
      },
      {
        title: t('reporting.token.options.other.title'),
        value: PortfolioDataReportOption.Other,
        additionalTextInput: true,
      },
    ],
    [t],
  )

  return (
    <ReportModal
      modalName={ModalName.ReportPortfolioData}
      modalTitle={t('reporting.portfolio.data.modal.title')}
      icon={ChartBarCrossed}
      reportOptions={reportOptions}
      isOpen={isOpen}
      submitReport={submitReport}
      onClose={onClose}
    />
  )
}
