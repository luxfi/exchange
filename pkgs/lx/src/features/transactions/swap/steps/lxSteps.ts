import { TokenApprovalTransactionStep } from 'lx/src/features/transactions/steps/approve'
import { TokenRevocationTransactionStep } from 'lx/src/features/transactions/steps/revoke'
import type { LXSignatureStep } from 'lx/src/features/transactions/swap/steps/signOrder'

export type LXSwapFlow = {
  revocation?: TokenRevocationTransactionStep
  approval?: TokenApprovalTransactionStep
  signOrder: LXSignatureStep
}

export type LXSwapSteps = NonNullable<LXSwapFlow[keyof LXSwapFlow]>

export function orderLXSteps(flow: LXSwapFlow): LXSwapSteps[] {
  const steps: LXSwapSteps[] = []

  if (flow.revocation) {
    steps.push(flow.revocation)
  }

  if (flow.approval) {
    steps.push(flow.approval)
  }

  steps.push(flow.signOrder)

  return steps
}
