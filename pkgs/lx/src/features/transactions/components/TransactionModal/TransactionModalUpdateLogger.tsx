import { useEffect } from 'react'
import type { ModalNameType } from 'lx/src/features/telemetry/constants'
import { ModalName } from 'lx/src/features/telemetry/constants'
import { useTransactionModalContext } from 'lx/src/features/transactions/components/TransactionModal/TransactionModalContext'
import { logContextUpdate } from 'utilities/src/logger/contextEnhancer'

export function TransactionModalUpdateLogger({ modalName }: { modalName: ModalNameType }): null {
  const { screen } = useTransactionModalContext()

  useEffect(() => {
    if (modalName === ModalName.Swap) {
      logContextUpdate('TransactionModal', { screen, modalName })
    }
  }, [modalName, screen])

  return null
}
