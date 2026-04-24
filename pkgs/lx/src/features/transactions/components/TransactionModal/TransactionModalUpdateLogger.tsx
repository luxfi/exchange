import { useEffect } from 'react'
import type { ModalNameType } from '@l.x/lx/src/features/telemetry/constants'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { useTransactionModalContext } from '@l.x/lx/src/features/transactions/components/TransactionModal/TransactionModalContext'
import { logContextUpdate } from '@l.x/utils/src/logger/contextEnhancer'

export function TransactionModalUpdateLogger({ modalName }: { modalName: ModalNameType }): null {
  const { screen } = useTransactionModalContext()

  useEffect(() => {
    if (modalName === ModalName.Swap) {
      logContextUpdate('TransactionModal', { screen, modalName })
    }
  }, [modalName, screen])

  return null
}
