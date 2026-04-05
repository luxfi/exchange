import React from 'react'
import { FiatOnRampStackNavigator } from 'src/app/navigation/navigation'
import { FullScreenNavModal } from 'src/components/modals/FullScreenNavModal'
<<<<<<< HEAD
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
=======
import { ModalName } from 'uniswap/src/features/telemetry/constants'
>>>>>>> upstream/main

export function FiatOnRampAggregatorModal(): JSX.Element {
  return (
    <FullScreenNavModal hideHandlebar={true} name={ModalName.FiatOnRampAggregator}>
      <FiatOnRampStackNavigator />
    </FullScreenNavModal>
  )
}
