import { useTranslation } from 'react-i18next'
import { WarningMessage } from 'lx/src/components/WarningMessage/WarningMessage'
import { WARNING_DEADLINE_TOLERANCE } from 'lx/src/constants/transactions'
import { useTransactionSettingsStore } from 'lx/src/features/transactions/components/settings/stores/transactionSettingsStore/useTransactionSettingsStore'

export function DeadlineWarning(): JSX.Element | null {
  const { t } = useTranslation()
  const customDeadline = useTransactionSettingsStore((state) => state.customDeadline)

  if (!customDeadline) {
    return null
  }

  if (customDeadline >= WARNING_DEADLINE_TOLERANCE) {
    return <WarningMessage warningMessage={t('swap.settings.deadline.warning')} color="$statusWarning" />
  }

  return null
}
