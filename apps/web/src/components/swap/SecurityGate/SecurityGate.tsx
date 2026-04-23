// Renders the regulated-asset disclosure box above the swap CTA when
// the gate is active. Component is a *sibling* of the SwapFlow at the
// page level — observers of the swap-form store get re-rendered on
// pair changes so the disclosure appears/disappears responsively.

import { Flex } from 'ui/src'
import { getRuntimeConfig } from '@l.x/config'
import { SecurityDisclosure } from '~/components/Swap/SecurityDisclosure'
import { useSecurityGate } from './useSecurityGate'

export function SecurityDisclosureBanner({ testID }: { testID?: string }): JSX.Element | null {
  const gate = useSecurityGate()
  if (!gate.active) return null
  const { securityDisclosure } = getRuntimeConfig()
  return (
    <Flex mb="$spacing8">
      <SecurityDisclosure disclosure={securityDisclosure} testID={testID} />
    </Flex>
  )
}

export { useSecurityGate } from './useSecurityGate'
export type { SecurityGateResult } from './useSecurityGate'
