import { useMemo } from 'react'
import { TransactionSummaryLayout } from 'lx/src/components/activity/summaries/TransactionSummaryLayout'
import { SummaryItemProps } from 'lx/src/components/activity/types'
import { TXN_HISTORY_ICON_SIZE } from 'lx/src/components/activity/utils'
import { DappLogoWithWCBadge } from 'lx/src/components/CurrencyLogo/LogoWithTxStatus'
import { TransactionDetails, WCConfirmInfo } from 'lx/src/features/transactions/types/transactionDetails'

export function WCSummaryItem({
  transaction,
  index,
  isExternalProfile,
}: SummaryItemProps & {
  transaction: TransactionDetails & { typeInfo: WCConfirmInfo }
}): JSX.Element {
  const icon = useMemo(
    () => (
      <DappLogoWithWCBadge
        chainId={transaction.chainId}
        dappImageUrl={transaction.typeInfo.dappRequestInfo.icon}
        dappName={transaction.typeInfo.dappRequestInfo.name}
        size={TXN_HISTORY_ICON_SIZE}
      />
    ),
    [transaction.chainId, transaction.typeInfo.dappRequestInfo.icon, transaction.typeInfo.dappRequestInfo.name],
  )

  return (
    <TransactionSummaryLayout
      caption={transaction.typeInfo.dappRequestInfo.name}
      icon={icon}
      index={index}
      transaction={transaction}
      isExternalProfile={isExternalProfile}
    />
  )
}
