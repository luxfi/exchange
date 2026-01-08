import { AutoColumn } from 'components/deprecated/Column'
import { deprecatedStyled } from 'lib/styled-components'
import { PropsWithChildren } from 'react'
import { Modal } from 'lx/src/components/modals/Modal'
import { ModalName } from 'lx/src/features/telemetry/constants'
import Trace from 'lx/src/features/telemetry/Trace'

const Content = deprecatedStyled(AutoColumn)`
  background-color: ${({ theme }) => theme.surface1};
  width: 100%;
  padding: 8px;
  gap: 12px;
`

export function SwapModal({
  children,
  onDismiss,
}: PropsWithChildren<{
  onDismiss: () => void
}>) {
  return (
    <Trace modal={ModalName.ConfirmSwap}>
      <Modal name={ModalName.SwapReview} isModalOpen onClose={onDismiss} padding={0}>
        <Content>{children}</Content>
      </Modal>
    </Trace>
  )
}
