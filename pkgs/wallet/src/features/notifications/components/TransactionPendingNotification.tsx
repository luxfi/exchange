import { useTranslation } from 'react-i18next'
import { SpinningLoader } from '@luxfi/ui/src'
import { NotificationToast } from '@l.x/lx/src/components/notifications/NotificationToast'
import { TRANSACTION_PENDING_NOTIFICATION_DELAY } from '@luxfi/wallet/src/features/notifications/components/SwapPendingNotification'

export function TransactionPendingNotification(): JSX.Element {
  const { t } = useTranslation()
  return (
    <NotificationToast
      smallToast
      hideDelay={TRANSACTION_PENDING_NOTIFICATION_DELAY}
      icon={<SpinningLoader color="$accent1" />}
      title={t('notification.transaction.pending')}
    />
  )
}
